<?php

namespace App\Http\Controllers;

use App\CatalogSearchModules;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;

class CatalogSearchModulesController extends Controller {
  /**
   * Gets paginated list of catalog search modules
   *
   * @return mixed Returns paginated list of catalog search modules
   */
  public function getCatalogSearchModules() {
    $catalogSearchModules = CatalogSearchModules::catalogSearchModules()->paginate(
      CatalogSearchModules::getPageSize()
    );

    return response()->json($catalogSearchModules);
  }

  /**
   * Gets catalog search module by moduleId
   *
   * @param int $moduleId
   * @return mixed Returns catalog search module or 404 status code
   *               when catalog search module is not found
   */
  public function getCatalogSearchModule(int $moduleId) {
    $catalogSearchModule = CatalogSearchModules::catalogSearchModule($moduleId);

    if (isset($catalogSearchModule)) {
      return response()->json($catalogSearchModule);
    } else {
      return response('', 404);
    }
  }

  /**
   * Creates new catalog search module
   *
   * @param Illuminate\Http\Request $request
   * @return void
   */
  public function createCatalogSearchModule(Request $request) {
    $this->validate($request, [
      'parent_id' => 'required|numeric',
      'search_placeholder' => 'required|string',
      'submit_label' => 'required|string',
    ]);

    DB::table('catalog_search_modules')->insert([
      'parent_id' => $request->input('parent_id'),
      'search_placeholder' => $request->input('search_placeholder', ''),
      'submit_label' => $request->input('submit_label', ''),
    ]);

    return response('', 204);
  }

  /**
   * Updates catalog search module module
   *
   * @param Illuminate\Http\Request $request
   * @param int $moduleId
   * @return void Returns 204 or 404 when catalog search module is not found
   */
  public function updateCatalogSearchModule(Request $request, int $moduleId) {
    $this->validate($request, [
      'search_placeholder' => 'string',
      'submit_label' => 'string',
    ]);

    $catalogSearchModule = CatalogSearchModules::catalogSearchModule($moduleId);

    if (isset($catalogSearchModule)) {
      DB::table('catalog_search_modules')
        ->where('parent_id', '=', $moduleId)
        ->update([
          'search_placeholder' => $request->input(
            'search_placeholder',
            $catalogSearchModule->search_placeholder
          ),
          'submit_label' => $request->input(
            'submit_label',
            $catalogSearchModule->submit_label
          ),
        ]);

      return response('', 204);
    } else {
      return response('', 404);
    }
  }

  /**
   * Deletes catalog search module

   * @param int $moduleId
   * @return void Returns 204 status code or 404 when catalog search 
   *              module is not found
   */
  public function deleteCatalogSearchModule(int $moduleId) {
    $catalogSearchModule = CatalogSearchModules::catalogSearchModule($moduleId);

    if (isset($catalogSearchModule)) {
      DB::table('catalog_search_modules')
        ->where('parent_id', '=', $moduleId)
        ->delete();

      return response('', 204);
    } else {
      return response('', 404);
    }
  }
}
