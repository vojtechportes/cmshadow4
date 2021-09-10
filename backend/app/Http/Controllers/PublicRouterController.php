<?php

namespace App\Http\Controllers;

use App\Pages;
use App\Views;
use App\Modules;
use App\Layouts;
use App\Templates;
use App\LayoutSlots;
use App\CatalogItems;
use App\CatalogCategories;
use App\VariableNameActions;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\View;
use Illuminate\Support\Collection;

class PublicRouterController extends Controller {
  private function isAuthorized(Request $request) {
    /**
     * Check whether current user is authorized or not
     */
    // TODO check also whether user is approved and if he has proper role

    // return Auth::check();

    // TODO just a temporary solution -vvv
    return $request->cookie('AUTH_USER');
  }

  private function getVariableNameBindings(
    Request $request,
    Collection $variableNameActions,
    array $pageParams
  ) {
    $isAuthorized = $this->isAuthorized($request);
    $bindings = [];
    foreach ($variableNameActions as $action) {
      $actionName = $action->action;

      switch ($actionName) {
        case 'GET_CATALOG_ITEM':
          if (array_key_exists($action->variable_name, $pageParams)) {
            $catalogItemId = $pageParams[$action->variable_name];

            if (
              ctype_digit($catalogItemId) &&
              $action->language_code !== null
            ) {
              $catalogItem = CatalogItems::publicCatalogItem(
                (int) $catalogItemId,
                $action->language_code,
                false,
                $isAuthorized
              );

              $bindings[$action->variable_name] = object_to_array($catalogItem);
            }
          }
          break;
        case 'GET_CATALOG_CATEGORY':
          if (array_key_exists($action->variable_name, $pageParams)) {
            $catalogCategoryId = $pageParams[$action->variable_name];

            if (ctype_digit($catalogCategoryId)) {
              $catalogCategory = CatalogCategories::catalogCategory(
                (int) $catalogCategoryId,
                true
              );

              if (isset($catalogCategory)) {
                $values = DB::table('catalog_category_values')
                  ->where('category_id', '=', $catalogCategoryId)
                  ->get();

                $catalogCategory->data = (object) [];

                if (isset($values)) {
                  foreach ($values as $value) {
                    $catalogCategory->data->{$value->language} = [
                      'name' => $value->name,
                      'description' => $value->description,
                    ];
                  }
                }

                $bindings[$action->variable_name] = object_to_array(
                  $catalogCategory
                );
              }
            }
          }
          break;
        case 'GET_PAGE_TAG':
          // TODO
          break;
      }
    }

    return $bindings;
  }

  private function getPage($path, Request $request) {
    $explodedPath = explode('/', $path);
    $pathDepth = count($explodedPath) - 1;
    $pathRegexp = [];

    if ($pathDepth > 0 && $path !== '/') {
      /**
       * Creates regex pattern that is trying to match either exact
       * path part or wildcard
       */
      foreach ($explodedPath as $part) {
        if ($part !== "") {
          array_push($pathRegexp, "({$part}|\{[^\}]+\})");
        }
      }

      $pathRegexp = "^(\/" . implode('\/', $pathRegexp) . ")$";
    } else {
      $pathRegexp = '^(\/)$';
    }

    $isAuthorized = $this->isAuthorized($request);

    /**
     * Selects best matches for requested path
     */
    $pages = DB::table('pages')
      ->whereRaw(
        "CHAR_LENGTH(path) - CHAR_LENGTH(REPLACE(path, '/', '')) = {$pathDepth}"
      )
      ->whereRaw("path REGEXP '{$pathRegexp}'");

    if ($isAuthorized) {
      $pages
        ->select(['id', 'identifier', 'path', 'version', 'template_id'])
        ->where(
          'version',
          '=',
          DB::raw(
            "(SELECT MAX(version) from pages as latest_version_pages WHERE latest_version_pages.identifier = pages.identifier)"
          )
        );
    } else {
      $pages
        ->select('id', 'identifier', 'path', 'version', 'template_id')
        ->where('status', '=', 'PUBLISHED');
    }

    $pages = $pages->get();

    if (count($pages) > 0) {
      $matched = [];

      /**
       * Checks whether any part of paths found in pages table
       * matches exactly the requested path
       */
      foreach ($explodedPath as $index => $part) {
        foreach ($pages as $page) {
          $explodedPagePath = explode('/', $page->path);

          if ($explodedPagePath[$index] === $part) {
            $matched[$page->id][$index] = true;
          }
        }
      }

      if (count($matched) > 0) {
        /**
         * Each level of page path is being check compared against
         * each other and pages with no exact match on given path level
         * are being not considered as good match
         */
        foreach ($explodedPath as $index => $part) {
          foreach ($pages as $page) {
            if (count($matched) > 1) {
              if (!isset($matched[$page->id][$index])) {
                unset($matched[$page->id]);
              }
            }
          }
        }
      } else {
        $matched[$pages[0]->id] = true;
      }

      $resultPageId = array_keys($matched)[0];
      $resultPage;

      foreach ($pages as $page) {
        if ($page->id === $resultPageId) {
          $resultPage = $page;
        }
      }

      $fullResultPage = Pages::pageById($resultPage->id);

      $params = [];
      $explodedPagePath = explode('/', $resultPage->path);

      foreach ($explodedPath as $index => $part) {
        preg_match('/^\{([^\}]+)\}$/', $explodedPagePath[$index], $matches);

        if (count($matches) > 0) {
          $params[$matches[1]] = $part;
        }
      }

      return ['data' => $fullResultPage, 'params' => $params];
    } else {
      return;
    }
  }

  private function buildTree(
    array &$elements,
    $parentId = null,
    $keys = ['parent' => 'tree_parent', 'id' => 'tree_id']
  ) {
    $branch = [];

    foreach ($elements as &$element) {
      if ($element[$keys['parent']] === $parentId) {
        $children = $this->buildTree($elements, $element[$keys['id']], $keys);

        if ($children) {
          $element['children'] = $children;
        }

        $branch[$element[$keys['id']]] = $element;

        unset($element);
      }
    }

    return $branch;
  }

  private function composeLayout($layoutSlots, $modules) {
    $elements = [];

    foreach ($layoutSlots as $slot) {
      $slotArray = get_object_vars($slot);

      $slotArray['tree_id'] = "slot__" . $slotArray['id'];
      $slotArray['tree_parent'] = "slot__" . $slotArray['parent_id'];
      $slotArray['content_type'] = 'SLOT';

      array_push($elements, $slotArray);
    }

    foreach ($modules as $module) {
      $moduleArray = get_object_vars($module);

      $moduleArray['parent_id'] = $moduleArray['slot_id'];
      $moduleArray['tree_id'] = "module__" . $moduleArray['id'];
      $moduleArray['tree_parent'] = "slot__" . $moduleArray['slot_id'];
      $moduleArray['content_type'] = 'MODULE';

      array_push($elements, $moduleArray);
    }

    $rootItems = array_filter($elements, function ($item) {
      return $item['parent_id'] === null && $item['content_type'] === "SLOT";
    });

    foreach ($rootItems as &$item) {
      $tree = $this->buildTree($elements, $item['tree_id'], [
        'parent' => 'tree_parent',
        'id' => 'tree_id',
      ]);

      if (count($tree) > 0) {
        $item['children'] = $tree;
      }
    }

    return $rootItems;
  }

  public function renderPage(Request $request) {
    $path = $request->path();
    $queryString = $request->all();

    if ($path !== '/') {
      $path = '/' . $path;
    }

    $page = $this->getPage($path, $request);

    if (isset($page)) {
      try {
        $pageParams = array_merge($page['params'], $queryString);
        $template = Templates::template($page['data']->template_id);
        $templatePages = Templates::templatePages($template->id);
        $templatePageIds = [];

        foreach ($templatePages as $templatePage) {
          array_push($templatePageIds, $templatePage->id);
        }

        $layout = Layouts::layout($template->layout_id);
        $layoutSlots = LayoutSlots::layoutSlots($layout->id)
          ->orderBy('weight', 'asc')
          ->get();

        $view = Views::view($template->view_id);
        $view->path = str_replace('/', '.', $view->path);

        $modules = Modules::modules(
          $page['data']->identifier,
          $page['data']->version,
          $template->layout_id,
          $templatePageIds
        )->get();

        $composedContent = $this->composeLayout($layoutSlots, $modules);
        $isAuthorized = $this->isAuthorized($request);

        $pageParamKeys = array_keys($pageParams);
        $variableNameActions = VariableNameActions::variableNameActions(
          $pageParamKeys,
          $page['data']->path
        )->get();
        $variableNameBindings = $this->getVariableNameBindings(
          $request,
          $variableNameActions,
          $pageParams
        );

        View::share([
          'global' => [
            'template' => object_to_array($template),
            'layout' => object_to_array($layout),
            'view' => object_to_array($view),
            'default_view_path' => 'default',
            'params' => $pageParams,
            'param_bindings' => $variableNameBindings,
            'request' => $request,
            'page' => object_to_array($page['data']),
            'is_authorized' => $isAuthorized,
          ],
        ]);

        return view($view->path . '.markup', [
          'components' => $composedContent,
        ]);
      } catch (Error $error) {
        return response('500 INTERNAL SERVER ERROR', 500);
      }
    } else {
      return response('404 PAGE NOT FOUND', 404);
    }
  }
}
