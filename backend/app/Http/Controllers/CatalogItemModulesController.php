<?php

namespace App\Http\Controllers;

use App\CatalogItemModules;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;

class CatalogItemModulesController extends Controller {
  /**
   * Gets paginated list of catalog item modules
   *
   * @return mixed Returns paginated list of catalog item modules
   */
  public function getCatalogItemModules() {
    $catalogItemModules = CatalogItemModules::catalogItemModules()->paginate(
      CatalogItemModules::getPageSize()
    );

    return response()->json($catalogItemModules);
  }

  /**
   * Gets catalog item module by moduleId
   *
   * @param int $moduleId
   * @return mixed Returns catalog item module or 404 status code
   *               when catalog item module is not found
   */
  public function getCatalogItemModule(int $moduleId) {
    $catalogItemModule = CatalogItemModules::catalogItemModule($moduleId);

    if (isset($catalogItemModule)) {
      return response()->json($catalogItemModule);
    } else {
      return response('', 404);
    }
  }

  /**
   * Creates new catalog item module
   *
   * @param Illuminate\Http\Request $request
   * @return void
   */
  public function createCatalogItemModule(Request $request) {
    $this->validate($request, [
      'parent_id' => 'required|numeric',
      'catalog_item_id' => 'required|numeric|exists:catalog_items,id',
      'language_code' => 'string|nullable',
    ]);

    DB::table('catalog_item_modules')->insert([
      'parent_id' => $request->input('parent_id'),
      'catalog_item_id' => $request->input('catalog_item_id'),
      'language_code' => $request->input('language_code', null),
    ]);

    return response('', 204);
  }

  /**
   * Updates catalog item module module
   *
   * @param Illuminate\Http\Request $request
   * @param int $moduleId
   * @return void Returns 204 or 404 when catalog item module is not found
   */
  public function updateCatalogItemModule(Request $request, int $moduleId) {
    $this->validate($request, [
      'catalog_item_id' => 'numeric|exists:catalog_items,id',
      'language_code' => 'string|nullable',
    ]);

    $catalogItemModule = CatalogItemModules::catalogItemModule($moduleId);

    if (isset($catalogItemModule)) {
      DB::table('catalog_item_modules')
        ->where('parent_id', '=', $moduleId)
        ->update([
          'catalog_item_id' => $request->input(
            'catalog_item_id',
            $catalogItemModule->catalog_item_id
          ),
          'language_code' => $request->input(
            'language_code',
            $catalogItemModule->language_code
          ),
        ]);

      return response('', 204);
    } else {
      return response('', 404);
    }
  }

  /**
   * Deletes catalog item module

   * @param int $moduleId
   * @return void Returns 204 status code or 404 when catalog item 
   *              module is not found
   */
  public function deleteCatalogItemModule(int $moduleId) {
    $catalogItemModule = CatalogItemModules::catalogItemModules($moduleId);

    if (isset($catalogItemModule)) {
      DB::table('catalog_item_modules')
        ->where('parent_id', '=', $moduleId)
        ->delete();

      return response('', 204);
    } else {
      return response('', 404);
    }
  }
}
