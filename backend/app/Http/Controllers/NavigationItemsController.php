<?php

namespace App\Http\Controllers;

use App\Navigations;
use App\NavigationItems;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;

class NavigationItemsController extends Controller {
  /**
   * Gets navigation item by navigationItemId
   *
   * @param string $navigationItemId
   * @return mixed Returns navigation item or 404 status code when
   *               navigation item is not found
   */
  public function getNavigationItem(int $navigationItemId) {
    $navigationItem = NavigationItems::navigationItem($navigationItemId);

    if (isset($navigationItem)) {
      if ($navigationItem->page_identifier !== null) {
        $page = DB::table('pages')
          ->select(
            'pages.identifier',
            'pages.path',
            'pages.status',
            'pages.name'
          )
          ->addSelect(
            DB::raw(
              "(" .
                "SELECT IF(" .
                "COUNT(published_page.identifier) > 0, 1, 0" .
                ") AS is_published " .
                "FROM pages as published_page " .
                "WHERE published_page.identifier = pages.identifier AND status = 'PUBLISHED'" .
                ") as is_published"
            )
          )
          ->addSelect(
            DB::raw(
              "(" .
                "SELECT published_page.path AS published_path " .
                "FROM pages as published_page " .
                "WHERE published_page.identifier = pages.identifier AND status = 'PUBLISHED'" .
                ") AS published_path"
            )
          )
          ->where('identifier', $navigationItem->page_identifier)
          ->where(
            'version',
            '=',
            DB::raw(
              "(SELECT MAX(version) from pages as latest_version_pages WHERE latest_version_pages.identifier = pages.identifier)"
            )
          )
          ->get()
          ->first();

        if (isset($page)) {
          $navigationItem->page = $page;
        }
      }

      return response()->json($navigationItem);
    } else {
      return response('', 404);
    }
  }

  /**
   * Creates new navigation item
   *
   * @param Illuminate\Http\Request $request
   * @param int $navigationId
   * @return mixed Returns id of created navigation
   */
  public function createNavigationItem(Request $request, int $navigationId) {
    $navigation = Navigations::navigation($navigationId);

    $this->validate($request, [
      'parent_id' => 'numeric|exists:navigation_items,id',
      'title' => 'required|string',
      'page_identifier' => 'string|exists:pages,identifier|nullable',
      'path' => 'string|nullable',
      'target' => [Rule::in(['BLANK', 'SELF', 'PARENT', 'TOP'])],
      'html_class_name' => 'string|nullable',
      'html_id' => 'string|nullable',
      'weight' => 'numeric',
    ]);

    $parent_id = $request->input('parent_id', null);
    $page_identifier = $request->input('page_identifier', null);
    $path = $request->input('path', null);
    $html_class_name = $request->input('html_class_name', null);
    $html_id = $request->input('html_id', null);

    if (isset($navigation)) {
      $id = DB::table('navigation_items')->insertGetId([
        'navigation_id' => $navigationId,
        'parent_id' => $parent_id === '' ? null : $parent_id,
        'title' => $request->input('title'),
        'page_identifier' => $page_identifier === '' ? null : $page_identifier,
        'path' => $path === '' ? null : $path,
        'target' => $request->input('target', 'SELF'),
        'html_class_name' => $html_class_name === '' ? null : $html_class_name,
        'html_id' => $html_id === '' ? null : $html_id,
        'weight' => $request->input('weight', 50),
      ]);

      return response()->json(['id' => $id]);
    } else {
      return response('', 404);
    }
  }

  /**
   * Updates navigation item
   *
   * @param Illuminate\Http\Request $request
   * @param int $navigationItemId
   * @return void Returns 204 or 404 when navigation item is not found
   */
  public function updateNavigationItem(
    Request $request,
    int $navigationItemId
  ) {
    $navigationItem = NavigationItems::navigationItem($navigationItemId);

    if (isset($navigationItem)) {
      $this->validate($request, [
        'parent_id' => 'numeric|exists:navigation_items,id',
        'title' => 'required|string',
        'page_identifier' => 'string|exists:pages,identifier|nullable',
        'path' => 'string|nullable',
        'target' => [Rule::in(['BLANK', 'SELF', 'PARENT', 'TOP'])],
        'html_class_name' => 'string|nullable',
        'html_id' => 'string|nullable',
        'weight' => 'numeric',
      ]);

      $parent_id = $request->input('parent_id', $navigationItem->parent_id);
      $page_identifier = $request->input(
        'page_identifier',
        $navigationItem->page_identifier
      );
      $path = $request->input('path', $navigationItem->path);
      $html_class_name = $request->input(
        'html_class_name',
        $navigationItem->html_class_name
      );
      $html_id = $request->input('html_id', $navigationItem->html_id);

      DB::table('navigation_items')
        ->where('id', '=', $navigationItemId)
        ->update([
          'parent_id' => $parent_id === '' ? null : $parent_id,
          'title' => $request->input('title', $navigationItem->title),
          'page_identifier' =>
            $page_identifier === '' ? null : $page_identifier,
          'path' => $path === '' ? null : $path,
          'target' => $request->input('target', $navigationItem->target),
          'html_class_name' =>
            $html_class_name === '' ? null : $html_class_name,
          'html_id' => $html_id === '' ? null : $html_id,
          'weight' => $request->input('weight', $navigationItem->weight),
        ]);

      return response('', 204);
    } else {
      return response('', 404);
    }
  }

  /**
   * Deletes navigation item and all its children

   * @param int $navigationItemId
   * @return void Returns 204 status code or 404 when navigation item
   *              is not found
   */
  public function deleteNavigationItem(int $navigationItemId) {
    $navigationItem = NavigationItems::navigationItem($navigationItemId);

    if (isset($navigationItem)) {
      DB::transaction(function () use ($navigationItemId) {
        $navigationItemIds = NavigationItems::getChildrenRecursive(
          $navigationItem->id,
          'navigation_items',
          'parent_id'
        );

        DB::table('navigation_items')
          ->whereIn('id', $navigationItemIds)
          ->delete();

        DB::table('navigation_item_variable_mappings')
          ->whereIn('navigaton_item_id', $navigationItemIds)
          ->delete();
      });

      return response('', 204);
    } else {
      return response('', 404);
    }
  }
}
