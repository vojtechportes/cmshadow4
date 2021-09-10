<?php

namespace App\Http\Controllers;

use App\Pages;
use App\Templates;
use App\TextModules;
use App\HeadingModules;
use App\ButtonModules;
use App\NavigationModules;
use App\ImageModules;
use App\CatalogListingModules;
use App\CatalogItemModules;
use App\CatalogCategoryTreeModules;
use App\CatalogCategoryModules;
use App\CatalogDetailModules;
use App\CatalogSearchModules;
use App\HtmlModules;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;
use Intervention\Image\ImageManagerStatic as Image;

class PagesController extends Controller {
  private function buildTree(
    array &$elements,
    $parentId = 0,
    $keys = ['parent' => 'parent', 'id' => 'identifier']
  ) {
    $branch = [];

    foreach ($elements as &$element) {
      if ($element[$keys['parent']] == $parentId) {
        $children = $this->buildTree($elements, $element['identifier'], $keys);

        if ($children) {
          $element['children'] = $children;
        }

        array_push($branch, $element);

        unset($element);
      }
    }

    usort($branch, function ($a, $b) {
      return $a['path'] <=> $b['path'];
    });

    return $branch;
  }

  /**
   * Gets paginated list of current versions of all pages by parent
   *
   * @return mixed Returns paginated list of current page versions by parent
   */
  public function getPagesCurrentVersion(Request $request) {
    $this->validate($request, [
      'parent' => 'string|exists:pages,identifier',
    ]);

    $parent = $request->input('parent', '');

    $pages = Pages::pagesCurrentVersion($parent);
    /**
     * Add select to determine whether page has children or not
     */
    $pages->addSelect(
      DB::raw(
        "(" .
          "SELECT IF(" .
          "COUNT(children_pages.identifier) > 0, 1, 0" .
          ") AS has_children " .
          "FROM pages as children_pages " .
          "WHERE children_pages.parent = pages.identifier " .
          ") as has_children"
      )
    );

    /**
     * Add select to determine whether the page has any published version
     */
    $pages->addSelect(
      DB::raw(
        "(" .
          "SELECT IF(" .
          "COUNT(published_page.identifier) > 0, 1, 0" .
          ") AS is_published " .
          "FROM pages as published_page " .
          "WHERE published_page.identifier = pages.identifier AND status = 'PUBLISHED'" .
          ") as is_published"
      )
    );

    return response()->json($pages->paginate(Pages::getPageSize()));
  }

  /**
   * Gets list of current versions of all pages organized to tree
   *
   * @return mixed Returns list of current page versions
   */
  public function getAllPagesCurrentVersion() {
    $items = [];
    $pages = Pages::allPagesCurrentVersion()->get();

    foreach ($pages as $page) {
      array_push($items, get_object_vars($page));
    }

    $rootItems = array_filter($items, function ($item) {
      return $item['parent'] === '';
    });

    foreach ($rootItems as &$item) {
      $tree = $this->buildTree($items, $item['identifier']);

      if (count($tree) > 0) {
        $item['children'] = $tree;
      }
    }

    return response()->json(array_values($rootItems));
  }

  /**
   * Gets paginated list of current versions of all pages by parent
   *
   * @param string $parent
   * @return mixed Returns paginated list of published pages by parent
   */

  public function getPublishedPages(string $parent = "") {
    $pages = Pages::publishedPages($parent)->paginate(Pages::getPageSize());

    return response()->json($pages);
  }

  /**
   * Gets page by identifier
   *
   * @param string $identifier
   * @return mixed Returns page or 404 status code when page is not found
   */
  public function getPage(string $identifier) {
    $page = Pages::page($identifier);

    if (isset($page)) {
      return response()->json($page);
    } else {
      return response('', 404);
    }
  }

  /**
   * Gets paginated list of page versions
   *
   * @param Illuminate\Http\Request $request
   * @param string $identifier
   * @return mixed Returns paginated list of page versions
   */
  public function getPageVersions(Request $request, string $identifier) {
    $sortOrder = $request->input('sort_order');
    $versionSortOder = 'asc';

    if ($sortOrder === 'desc') {
      $versionSortOder = $sortOrder;
    }

    $pages = Pages::pageVersions($identifier, $versionSortOder)->paginate(
      Pages::getPageSize()
    );

    return response()->json($pages);
  }

  /**
   * Creates new page
   *
   * @param Illuminate\Http\Request $request
   * @return mixed Returns id of created page
   */
  public function createPage(Request $request) {
    $this->validate($request, [
      'name' => 'required|max:255',
      'template_id' => 'required|numeric|exists:templates,id',
      'path' => 'required|unique:pages|max:500',
      'meta_title' => 'string',
      'meta_description' => 'string',
      'meta_keywords' => 'string',
      'meta_robots' => [
        Rule::in([
          'ALL',
          'NOINDEX',
          'NOINDEX_NOFOLLOW',
          'INDEX_NOFOLLOW',
          'INDEX_FOLLOW',
        ]),
      ],
      'meta_canonical' => 'string',
      'meta_image' => 'image',
      'html_head_end' => 'string',
      'html_body_start' => 'string',
      'html_body_end' => 'string',
    ]);

    $uuid = Pages::getUUID();
    $meta_image = null;

    if ($request->hasFile('meta_image')) {
      $image = $request->meta_image;
      $fileName = Pages::getUUID() . '.' . $image->extension();
      $filePath = realpath(base_path(CMS_UPLOAD_IMAGE_PATH));

      if ($image->move($filePath, $fileName)) {
        // Resize the image thumbnail and save
        $image = Image::make($filePath . '/' . $fileName);
        $image->resize(
          SETTINGS_PAGE_META_IMAGE_WIDTH,
          SETTINGS_PAGE_META_IMAGE_HEIGHT,
          function ($constraint) {
            $constraint->aspectRatio();
            $constraint->upsize();
          }
        );

        $image->save(
          $filePath . '/' . $fileName,
          SETTINGS_PAGE_META_IMAGE_QUALITY
        );

        $meta_image = $fileName;
      }
    }

    DB::table('pages')->insert([
      'identifier' => $uuid,
      'parent' => $request->input('parent', ''),
      'name' => $request->input('name'),
      'template_id' => $request->input('template_id'),
      'path' => $request->input('path'),
      'version' => 1,
      'meta_title' => $request->input('meta_title', ''),
      'meta_description' => $request->input('meta_description', ''),
      'meta_keywords' => $request->input('meta_keywords', ''),
      'meta_robots' => $request->input('meta_robots', 'INDEX_FOLLOW'),
      'meta_canonical' => $request->input('meta_canonical', null),
      'meta_image' => $meta_image,
      'html_head_end' => $request->input('html_head_end', ''),
      'html_body_start' => $request->input('html_body_start', ''),
      'html_body_end' => $request->input('html_body_end', ''),
    ]);

    return response()->json(['identifier' => $uuid]);
  }

  /**
   * Updates page by creating new version
   *
   * @param Illuminate\Http\Request $request
   * @param string $identifier
   * @return mixed Returns id of updated page or 404 response
   */

  public function updatePage(Request $request, string $identifier) {
    $page = Pages::page($identifier);

    if (isset($page)) {
      $this->validate($request, [
        'name' => 'max:255',
        'template_id' => 'numeric|exists:templates,id',
        'path' => "unique:pages,path,{$page->identifier},identifier|max:500",
        'meta_title' => 'string',
        'meta_description' => 'string',
        'meta_keywords' => 'string',
        'meta_robots' => [
          Rule::in([
            'ALL',
            'NOINDEX',
            'NOINDEX_NOFOLLOW',
            'INDEX_NOFOLLOW',
            'INDEX_FOLLOW',
          ]),
        ],
        'meta_canonical' => 'string|nullable',
        'meta_image' => 'image|nullable',
        'html_head_end' => 'string',
        'html_body_start' => 'string',
        'html_body_end' => 'string',
      ]);

      $meta_image = $request->input('meta_image', $page->meta_image);
      $meta_canonical = $request->input(
        'meta_canonical',
        $page->meta_canonical
      );

      if ($request->hasFile('meta_image')) {
        $image = $request->meta_image;
        $fileName = Pages::getUUID() . '.' . $image->extension();
        $filePath = realpath(base_path(CMS_UPLOAD_IMAGE_PATH));

        if ($image->move($filePath, $fileName)) {
          // Resize the image thumbnail and save
          $image = Image::make($filePath . '/' . $fileName);
          $image->resize(
            SETTINGS_PAGE_META_IMAGE_WIDTH,
            SETTINGS_PAGE_META_IMAGE_HEIGHT,
            function ($constraint) {
              $constraint->aspectRatio();
              $constraint->upsize();
            }
          );

          $image->save(
            $filePath . '/' . $fileName,
            SETTINGS_PAGE_META_IMAGE_QUALITY
          );

          $meta_image = $fileName;
        }
      }

      $version = $page->version + 1;

      DB::table('pages')->insert([
        'identifier' => $page->identifier,
        'parent' => $request->input('parent', $page->parent),
        'name' => $request->input('name', $page->name),
        'template_id' => $request->input('template_id', $page->template_id),
        'path' => $request->input('path', $page->path),
        'version' => $version,
        'created_at' => $page->created_at,
        'modified_at' => date('Y-m-d H:i:s'),
        'meta_title' => $request->input('meta_title', $page->meta_title),
        'meta_description' => $request->input(
          'meta_description',
          $page->meta_description
        ),
        'meta_keywords' => $request->input(
          'meta_keywords',
          $page->meta_keywords
        ),
        'meta_robots' => $request->input('meta_robots', $page->meta_keywords),
        'meta_canonical' => $meta_canonical === '' ? null : $meta_canonical,
        'meta_image' => $meta_image === '' ? null : $meta_image,
        'html_head_end' => $request->input(
          'html_head_end',
          $page->html_head_end
        ),
        'html_body_start' => $request->input(
          'html_body_start',
          $page->html_body_start
        ),
        'html_body_end' => $request->input(
          'html_body_end',
          $page->html_body_end
        ),
      ]);

      return response()->json([
        'identifier' => $page->identifier,
        'version' => $version,
      ]);
    } else {
      return response('', 404);
    }
  }

  public function setPageModules(Request $request, string $identifier) {
    $this->validate($request, [
      'modules' => 'required',
      'version' => 'required|numeric',
    ]);

    $modules = json_decode($request->input('modules'), true);
    $version = $request->input('version');

    $page = Pages::pageVersion($identifier, $version);

    if (isset($page)) {
      $template = Templates::template($page->template_id);

      DB::transaction(function () use (
        $modules,
        $version,
        $template,
        $identifier,
        $request
      ) {
        foreach ($modules as $slot) {
          $previousModuleWeight = 0;

          foreach ($slot as $key => $module) {
            $weight = ($key + 1) * 10 + $previousModuleWeight;

            if ($module['isTemplatePageModule'] === false) {
              $moduleId = DB::table('modules')->insertGetId([
                'page_identifier' => $identifier,
                'page_version' => $version,
                'layout_id' => $template->layout_id,
                'slot_id' => $module['slotId'],
                'weight' => $weight,
                'page_type' => 'PAGE',
                'module_type' => $module['moduleType'],
              ]);

              switch ($module['moduleType']) {
                case 'HEADING':
                  if ($module['isNew']) {
                    HeadingModules::insertHeadingModule(
                      $moduleId,
                      $module['data']['level'],
                      $module['data']['content']
                    );
                  } else {
                    $headingModule = HeadingModules::headingModule(
                      $module['moduleId']
                    );

                    if (isset($headingModule)) {
                      if ($module['isTouched']) {
                        HeadingModules::insertHeadingModule(
                          $moduleId,
                          $module['data']['level'],
                          $module['data']['content']
                        );
                      } else {
                        HeadingModules::insertHeadingModule(
                          $moduleId,
                          $headingModule->level,
                          $headingModule->content
                        );
                      }
                    }
                  }
                  break;
                case 'TEXT':
                  if ($module['isNew']) {
                    TextModules::insertTextModule(
                      $moduleId,
                      $module['data']['content']
                    );
                  } else {
                    $textModule = TextModules::textModule($module['moduleId']);

                    if (isset($textModule)) {
                      if ($module['isTouched']) {
                        TextModules::insertTextModule(
                          $moduleId,
                          $module['data']['content']
                        );
                      } else {
                        TextModules::insertTextModule(
                          $moduleId,
                          $textModule->content
                        );
                      }
                    }
                  }
                  break;
                case 'HTML':
                  if ($module['isNew']) {
                    HtmlModules::insertHtmlModule(
                      $moduleId,
                      $module['data']['content']
                    );
                  } else {
                    $htmlModule = HtmlModules::htmlModule($module['moduleId']);

                    if (isset($htmlModule)) {
                      if ($module['isTouched']) {
                        HtmlModules::insertHtmlModule(
                          $moduleId,
                          $module['data']['content']
                        );
                      } else {
                        HtmlModules::insertHtmlModule(
                          $moduleId,
                          $htmlModule->content
                        );
                      }
                    }
                  }
                  break;
                case 'NAVIGATION':
                  if ($module['isNew']) {
                    NavigationModules::insertNavigationModule(
                      $moduleId,
                      $module['data']['navigation_id']
                    );
                  } else {
                    $navigationModule = NavigationModules::navigationModule(
                      $module['moduleId']
                    );

                    if (isset($navigationModule)) {
                      if ($module['isTouched']) {
                        NavigationModules::insertNavigationModule(
                          $moduleId,
                          $module['data']['navigation_id']
                        );
                      } else {
                        NavigationModules::insertNavigationModule(
                          $moduleId,
                          $navigationModule->navigation_id
                        );
                      }
                    }
                  }
                  break;
                case 'IMAGE':
                  $newPath;

                  if (array_key_exists('image', $module['data'])) {
                    if ($request->hasFile('files_' . $module['uuid'])) {
                      $image = $request->file('files_' . $module['uuid']);

                      $fileName =
                        ImageModules::getUUID() . '.' . $image->extension();
                      $filePath = realpath(base_path(CMS_UPLOAD_IMAGE_PATH));

                      if ($image->move($filePath, $fileName)) {
                        $newPath = $fileName;
                      }
                    }
                  }

                  if ($module['isNew']) {
                    ImageModules::insertImageModule(
                      $moduleId,
                      isset($newPath) ? $newPath : '',
                      $module['data']['image_alt']
                    );
                  } else {
                    $imageModule = ImageModules::imageModule(
                      $module['moduleId']
                    );

                    if (isset($imageModule)) {
                      if ($module['isTouched']) {
                        ImageModules::insertImageModule(
                          $moduleId,
                          isset($newPath)
                            ? $newPath
                            : $module['data']['file_name'],
                          $module['data']['image_alt']
                        );
                      } else {
                        ImageModules::insertImageModule(
                          $moduleId,
                          $imageModule->file_name,
                          $imageModule->image_alt
                        );
                      }
                    }
                  }

                  unset($newPath);
                  break;
                case 'BUTTON':
                  if ($module['isNew']) {
                    ButtonModules::insertButtonModule(
                      $moduleId,
                      $module['data']['text'],
                      $module['data']['path'],
                      $module['data']['target'],
                      $module['data']['button_id']
                    );
                  } else {
                    $buttonModule = ButtonModules::buttonModule(
                      $module['moduleId']
                    );

                    if (isset($buttonModule)) {
                      if ($module['isTouched']) {
                        ButtonModules::insertButtonModule(
                          $moduleId,
                          $module['data']['text'],
                          $module['data']['path'],
                          $module['data']['target'],
                          $module['data']['button_id']
                        );
                      } else {
                        ButtonModules::insertButtonModule(
                          $moduleId,
                          $buttonModule->text,
                          $buttonModule->path,
                          $buttonModule->target,
                          $buttonModule->button_id
                        );
                      }
                    }
                  }
                  break;
                case 'CATALOG_LISTING':
                  if ($module['isNew']) {
                    CatalogListingModules::insertCatalogListingModule(
                      $moduleId,
                      $module['data']['language_code'],
                      $module['data']['category_id'],
                      $module['data']['category_id_variable_name']
                    );
                  } else {
                    $catalogListingModule = CatalogListingModules::catalogListingModule(
                      $module['moduleId']
                    );

                    if (isset($catalogListingModule)) {
                      if ($module['isTouched']) {
                        CatalogListingModules::insertCatalogListingModule(
                          $moduleId,
                          $module['data']['language_code'],
                          $module['data']['category_id'],
                          $module['data']['category_id_variable_name']
                        );
                      } else {
                        CatalogListingModules::insertCatalogListingModule(
                          $moduleId,
                          $catalogListingModule->language_code,
                          $catalogListingModule->category_id,
                          $catalogListingModule->category_id_variable_name
                        );
                      }
                    }
                  }
                  break;
                case 'CATALOG_ITEM':
                  if ($module['isNew']) {
                    CatalogItemModules::insertCatalogItemModule(
                      $moduleId,
                      $module['data']['catalog_item_id'],
                      $module['data']['language_code']
                    );
                  } else {
                    $catalogItemModule = CatalogItemModules::catalogItemModule(
                      $module['moduleId']
                    );

                    if (isset($catalogItemModule)) {
                      if ($module['isTouched']) {
                        CatalogItemModules::insertCatalogItemModule(
                          $moduleId,
                          $module['data']['catalog_item_id'],
                          $module['data']['language_code']
                        );
                      } else {
                        CatalogItemModules::insertCatalogItemModule(
                          $moduleId,
                          $catalogItemModule->catalog_item_id,
                          $catalogItemModule->language_code
                        );
                      }
                    }
                  }
                  break;
                case 'CATALOG_CATEGORY_TREE':
                  if ($module['isNew']) {
                    CatalogCategoryTreeModules::insertCatalogCategoryTreeModule(
                      $moduleId,
                      $module['data']['parent_category_id'],
                      $module['data']['display_if_parent_category_id'],
                      $module['data']['language_code'],
                      $module['data']['link_pattern']
                    );
                  } else {
                    $catalogCategoryTreeModule = CatalogCategoryTreeModules::catalogCategoryTreeModule(
                      $module['moduleId']
                    );

                    if (isset($catalogCategoryTreeModule)) {
                      if ($module['isTouched']) {
                        CatalogCategoryTreeModules::insertCatalogCategoryTreeModule(
                          $moduleId,
                          $module['data']['parent_category_id'],
                          $module['data']['display_if_parent_category_id'],
                          $module['data']['language_code'],
                          $module['data']['link_pattern']
                        );
                      } else {
                        CatalogCategoryTreeModules::insertCatalogCategoryTreeModule(
                          $moduleId,
                          $catalogCategoryTreeModule->parent_category_id,
                          $catalogCategoryTreeModule->display_if_parent_category_id,
                          $catalogCategoryTreeModule->language_code,
                          $catalogCategoryTreeModule->link_pattern
                        );
                      }
                    }
                  }
                  break;
                case 'CATALOG_CATEGORY':
                  if ($module['isNew']) {
                    CatalogCategoryModules::insertCatalogCategoryModule(
                      $moduleId,
                      $module['data']['category_id'],
                      $module['data']['language_code'],
                      $module['data']['category_id_variable_name'],
                      $module['data']['load_from_global_context']
                    );
                  } else {
                    $catalogCategoryModule = CatalogCategoryModules::catalogCategoryModule(
                      $module['moduleId']
                    );

                    if (isset($catalogCategoryModule)) {
                      if ($module['isTouched']) {
                        CatalogCategoryModules::insertCatalogCategoryModule(
                          $moduleId,
                          $module['data']['category_id'],
                          $module['data']['language_code'],
                          $module['data']['category_id_variable_name'],
                          $module['data']['load_from_global_context']
                        );
                      } else {
                        CatalogCategoryModules::insertCatalogCategoryModule(
                          $moduleId,
                          $catalogCategoryModule->category_id,
                          $catalogCategoryModule->language_code,
                          $catalogCategoryModule->category_id_variable_name,
                          $catalogCategoryModule->load_from_global_context
                        );
                      }
                    }
                  }
                  break;
                case 'CATALOG_DETAIL':
                  if ($module['isNew']) {
                    CatalogDetailModules::insertCatalogDetailModule(
                      $moduleId,
                      $module['data']['catalog_item_id'],
                      $module['data']['language_code'],
                      $module['data']['catalog_item_id_variable_name'],
                      $module['data']['load_from_global_context']
                    );
                  } else {
                    $catalogDetailModule = CatalogDetailModules::catalogDetailModule(
                      $module['moduleId']
                    );

                    if (isset($catalogDetailModule)) {
                      if ($module['isTouched']) {
                        CatalogDetailModules::insertCatalogDetailModule(
                          $moduleId,
                          $module['data']['catalog_item_id'],
                          $module['data']['language_code'],
                          $module['data']['catalog_item_id_variable_name'],
                          $module['data']['load_from_global_context']
                        );
                      } else {
                        CatalogDetailModules::insertCatalogDetailModule(
                          $moduleId,
                          $catalogDetailModule->catalog_item_id,
                          $catalogDetailModule->language_code,
                          $catalogDetailModule->catalog_item_id_variable_name,
                          $catalogDetailModule->load_from_global_context
                        );
                      }
                    }
                  }
                  break;
                case 'CATALOG_SEARCH':
                  if ($module['isNew']) {
                    CatalogSearchModules::insertCatalogSearchModule(
                      $moduleId,
                      $module['data']['search_placeholder'],
                      $module['data']['submit_label']
                    );
                  } else {
                    $catalogSearchModule = CatalogSearchModules::catalogSearchModule(
                      $module['moduleId']
                    );

                    if (isset($catalogSearchModule)) {
                      if ($module['isTouched']) {
                        CatalogSearchModules::insertCatalogSearchModule(
                          $moduleId,
                          $module['data']['search_placeholder'],
                          $module['data']['submit_label']
                        );
                      } else {
                        CatalogSearchModules::insertCatalogSearchModule(
                          $moduleId,
                          $catalogSearchModule->search_placeholder,
                          $catalogSearchModule->submit_label
                        );
                      }
                    }
                  }
                  break;
              }
            } else {
              $previousModuleWeight = $module['weight'];
            }
          }
        }
      });

      return response('', 204);
    }

    return response('', 404);
  }

  /**
   * Reverts page to specified version by creating new version as latest version in DRAFT status
   *
   * @param Illuminate\Http\Request $request
   * @param string $identifier
   * @return mixed Returns id of updated page or 404 response
   */

  public function revertToVersion(string $identifier, int $version) {
    $page = Pages::page($identifier);
    $pageVersion = Pages::pageVersion($identifier, $version);

    if (isset($page) && isset($pageVersion)) {
      $newVersion = $page->version + 1;

      $id = DB::table('pages')->insertGetId([
        'identifier' => $identifier,
        'parent' => $pageVersion->parent,
        'name' => $pageVersion->name,
        'template_id' => $pageVersion->template_id,
        'path' => $pageVersion->path,
        'version' => $newVersion,
        'created_at' => $pageVersion->created_at,
        'modified_at' => date('Y-m-d H:i:s'),
        'meta_title' => $pageVersion->meta_title,
        'meta_description' => $pageVersion->meta_description,
        'meta_keywords' => $pageVersion->meta_keywords,
        'meta_robots' => $pageVersion->meta_keywords,
        'meta_canonical' => $pageVersion->meta_canonical,
        'meta_image' => $pageVersion->meta_image,
        'html_head_end' => $pageVersion->html_head_end,
        'html_body_start' => $pageVersion->html_body_start,
        'html_body_end' => $pageVersion->html_body_end,
      ]);

      return response()->json(['id' => $id]);
    } else {
      return response('', 404);
    }
  }

  /**
   * Helper method changing status of page
   *
   * @param string $identifier
   * @param int $pageId
   * @param string $toStatus (DRAFT, UNPUBLISHED, PUBLISHED, DELETED)
   * @return void
   */
  public function changePageStatus(
    string $identifier,
    int $pageId,
    string $toStatus
  ) {
    DB::table('pages')
      ->where('identifier', '=', $identifier)
      ->where('status', '!=', 'DFRAFT')
      ->update(['status' => 'DRAFT']);

    DB::table('pages')
      ->where('id', '=', $pageId)
      ->update(['status' => $toStatus, 'modified_at' => date('Y-m-d H:i:s')]);
  }

  /**
   * Publishes latest version of page
   *
   * @param string $identifier
   * @return mixed Returns 204 satus code when page is published, 405 when page is already
   *               publsihed or 404 when page doesn't exist
   */
  public function publishPage(string $identifier) {
    $page = Pages::page($identifier);

    if ($page->status === 'PUBLISHED') {
      return response('', 405);
    }

    if (isset($page)) {
      $this->changePageStatus($identifier, $page->id, 'PUBLISHED');

      return response('', 204);
    } else {
      return response('', 404);
    }
  }

  /**
   * Unpublishes latest version of page
   *
   * @param string $identifier
   * @return mixed Returns 204 satus code when page is unpublished, 405 when page is already
   *               unpublished or delted or 404 when page doesn't exist
   */
  public function unpublishPage(string $identifier) {
    $page = Pages::page($identifier);

    if ($page->status === 'DELTED' || $page->status === 'UNPUBLISHED') {
      return response('', 405);
    }

    if (isset($page)) {
      $this->changePageStatus($identifier, $page->id, 'UNPUBLISHED');

      return response('', 204);
    } else {
      return response('', 404);
    }
  }

  /**
   * Deleted latest version of page
   *
   * @param string $identifier
   * @return mixed Returns 204 satus code when page is deleted, 405 when page is already
   *               delted or 404 when page doesn't exist
   */
  public function deletePage(string $identifier) {
    $page = Pages::page($identifier);

    if ($page->status === 'DELETED') {
      return response('', 405);
    }

    if (isset($page)) {
      $this->changePageStatus($identifier, $page->id, 'DELETED');

      return response('', 204);
    } else {
      return response('', 404);
    }
  }
}
