<?php

namespace App\Http\Controllers;

use App\CatalogCategoryTreeModules;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;

class CatalogCategoryTreeModulesController extends Controller {
  /**
   * Gets paginated list of catalog category tree modules
   *
   * @return mixed Returns paginated list of catalog category tree modules
   */
  public function getCatalogCategoryTreeModules() {
    $catalogCategoryTreeModules = CatalogCategoryTreeModules::catalogCategoryTreeModules()->paginate(
      CatalogCategoryTreeModules::getPageSize()
    );

    return response()->json($catalogCategoryTreeModules);
  }

  /**
   * Gets catalog category tree module by moduleId
   *
   * @param int $moduleId
   * @return mixed Returns catalog category tree module or 404 status code when catalog category tree module is not found
   */
  public function getCatalogCategoryTreeModule(int $moduleId) {
    $catalogCategoryTreeModule = CatalogCategoryTreeModules::catalogCategoryTreeModule(
      $moduleId
    );

    if (isset($catalogCategoryTreeModule)) {
      return response()->json($catalogCategoryTreeModule);
    } else {
      return response('', 404);
    }
  }

  /**
   * Creates new catalog category tree module
   *
   * @param Illuminate\Http\Request $request
   * @return void
   */
  public function createCatalogCategoryTreeModule(Request $request) {
    $this->validate($request, [
      'parent_id' => 'required|numeric',
      'parent_category_id' => 'numeric|nullable',
      'display_if_parent_category_id' => 'numeric|nullable',
      'language_code' => 'string|nullable',
      'link_pattern' => 'string',
    ]);

    DB::table('catalog_category_tree_modules')->insert([
      'parent_id' => $request->input('parent_id'),
      'parent_category_id' => $request->input('parent_category_id', null),
      'display_if_parent_category_id' => $request->input(
        'parent_category_id',
        null
      ),
      'language_code' => $request->input('parent_category_id', null),
      'link_pattern' => $request->input('link_pattern', ''),
    ]);

    return response('', 204);
  }

  /**
   * Updates catalog category tree module
   *
   * @param Illuminate\Http\Request $request
   * @param int $moduleId
   * @return void Returns 204 or 404 when catalog category tree module is not found
   */
  public function updateCatalogCategoryTreeModule(
    Request $request,
    int $moduleId
  ) {
    $catalogCategoryTreeModule = CatalogCategoryTreeModules::catalogCategoryTreeModule(
      $moduleId
    );

    $this->validate($request, [
      'parent_category_id' => 'numeric|nullable',
      'display_if_parent_category_id' => 'numeric|nullable',
      'language_code' => 'string|nullable',
      'link_pattern' => 'string',
    ]);

    if (isset($catalogCategoryTreeModule)) {
      DB::table('catalog_category_tree_modules')
        ->where('parent_id', '=', $moduleId)
        ->update([
          'parent_id' => $moduleId,
          'parent_category_id' => $request->input(
            'parent_category_id',
            $catalogCategoryTreeModule->parent_category_id
          ),
          'display_if_parent_category_id' => $request->input(
            'display_if_parent_category_id',
            $catalogCategoryTreeModule->display_if_parent_category_id
          ),
          'language_code' => $request->input(
            'language_code',
            $catalogCategoryTreeModule->language_code
          ),
          'link_pattern' => $request->input(
            'language_code',
            $catalogCategoryTreeModule->link_pattern
          ),
        ]);

      return response('', 204);
    } else {
      return response('', 404);
    }
  }

  /**
   * Deletes catalog category tree module

   * @param int $moduleId
   * @return void Returns 204 status code or 404 when catalog category tree module is not found
   */
  public function deleteCatalogCategoryTreeModule(int $moduleId) {
    $catalogCategoryTreeModule = CatalogCategoryTreeModules::catalogCategoryTreeModule(
      $moduleId
    );

    if (isset($catalogCategoryTreeModule)) {
      DB::table('catalog_category_tree_modules')
        ->where('parent_id', '=', $moduleId)
        ->delete();

      return response('', 204);
    } else {
      return response('', 404);
    }
  }
}
