<?php

namespace App\Http\Controllers;

use App\CatalogDetailModules;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;

class CatalogDetailModulesController extends Controller {
  /**
   * Gets paginated list of catalog detailmodules
   *
   * @return mixed Returns paginated list of catalog detail modules
   */
  public function getCatalogDetailModules() {
    $catalogDetailModules = CatalogDetailModules::catalogDetailModules()->paginate(
      CatalogDetailModules::getPageSize()
    );

    return response()->json($catalogDetailModules);
  }

  /**
   * Gets catalog detailmodule by moduleId
   *
   * @param int $moduleId
   * @return mixed Returns catalog detail module or 404 status code when catalog detail module is not found
   */
  public function getCatalogDetailModule(int $moduleId) {
    $catalogDetailModule = CatalogDetailModules::catalogDetailModule($moduleId);

    if (isset($catalogDetailModule)) {
      return response()->json($catalogDetailModule);
    } else {
      return response('', 404);
    }
  }

  /**
   * Creates new catalog detail module
   *
   * @param Illuminate\Http\Request $request
   * @return void
   */
  public function createCatalogDetailModule(Request $request) {
    $this->validate($request, [
      'parent_id' => 'required|numeric',
      'category_item_id' => 'numeric|nullable',
      'language_code' => 'string|nullable',
      'catalog_item_id_variable_name' => 'string|nullable',
      'load_from_global_context' => 'boolean',
    ]);

    DB::table('catalog_detail_modules')->insert([
      'parent_id' => $request->input('parent_id'),
      'catalog_item_id' => $request->input('catalog_item_id', null),
      'language_code' => $request->input('language_code', null),
      'catalog_item_id_variable_name' => $request->input(
        'catalog_item_id_variable_name',
        null
      ),
      'load_from_global_context' => $request->input(
        'load_from_global_context',
        false
      ),
    ]);

    return response('', 204);
  }

  /**
   * Updates catalog detailmodule
   *
   * @param Illuminate\Http\Request $request
   * @param int $moduleId
   * @return void Returns 204 or 404 when catalog detail module is not found
   */
  public function updateCatalogDetailModule(Request $request, int $moduleId) {
    $catalogDetailModule = CatalogDetailModules::catalogDetailModule($moduleId);

    $this->validate($request, [
      'catalog_item_id' => 'numeric|nullable',
      'language_code' => 'string|nullable',
      'catalog_item_id_variable_name' => 'string|nullable',
      'load_from_global_context' => 'boolean',
    ]);

    if (isset($catalogItemDetailModule)) {
      $catalogItemId = $request->input(
        'catalog_item_id',
        $catalogDetailModule->catalog_item_id
      );
      $languageCode = $request->input(
        'language_code',
        $catalogDetailModule->language_code
      );
      $catalogItemIdVariableName = $request->input(
        'catalog_item_id_variable_name',
        $catalogItemDetailModule->catalog_item_id_variable_name
      );

      DB::table('catalog_detail_modules')
        ->where('parent_id', '=', $moduleId)
        ->update([
          'parent_id' => $moduleId,
          'catalog_item_id' => $catalogItemId === '' ? null : $catalogItemId,
          'language_code' => $languageCode === '' ? null : $languageCode,
          'catalog_item_id_variable_name' =>
            $catalogItemIdVariableName === ''
              ? null
              : $catalogItemIdVariableName,
          'load_from_global_context' => $request->input(
            'load_from_global_context',
            $catalogItemDetailModule->load_from_global_context
          ),
        ]);

      return response('', 204);
    } else {
      return response('', 404);
    }
  }

  /**
   * Deletes catalog detailmodule

   * @param int $moduleId
   * @return void Returns 204 status code or 404 when catalog detailmodule is not found
   */
  public function deleteCatalogDetailModule(int $moduleId) {
    $catalogDetailModule = CatalogDetailModules::catalogDetailModule($moduleId);

    if (isset($catalogDetailModule)) {
      DB::table('catalog_detail_modules')
        ->where('parent_id', '=', $moduleId)
        ->delete();

      return response('', 204);
    } else {
      return response('', 404);
    }
  }
}
