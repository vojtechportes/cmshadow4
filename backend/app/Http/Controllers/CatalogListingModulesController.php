<?php

namespace App\Http\Controllers;

use App\CatalogListingModules;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;

class CatalogListingModulesController extends Controller {
  /**
   * Gets paginated list of catalog listing modules
   *
   * @return mixed Returns paginated list of catalog listing modules
   */
  public function getCatalogListingModules() {
    $catalogListingModules = CatalogListingModules::catalogListingModules()->paginate(
      CatalogListingModules::getPageSize()
    );

    return response()->json($catalogListingModules);
  }

  /**
   * Gets catalog listing module by moduleId
   *
   * @param int $moduleId
   * @return mixed Returns catalog listing module or 404 status code
   *               when catalog listing module is not found
   */
  public function getCatalogListingModule(int $moduleId) {
    $catalogListingModule = CatalogListingModules::catalogListingModule(
      $moduleId
    );

    if (isset($catalogListingModule)) {
      return response()->json($catalogListingModule);
    } else {
      return response('', 404);
    }
  }

  /**
   * Creates new catalog listing module
   *
   * @param Illuminate\Http\Request $request
   * @return void
   */
  public function createCatalogListingModule(Request $request) {
    $this->validate($request, [
      'parent_id' => 'required|numeric',
      'language_code' => 'string|nullable',
      'category_id' => 'numeric|nullable',
      'category_id_variable_name' => 'string|nullable',
    ]);

    DB::table('catalog_listing_modules')->insert([
      'parent_id' => $request->input('parent_id'),
      'language_code' => $request->input('language_code', null),
      'category_id' => $request->input('category_id', null),
      'category_id_variable_name' => $request->input(
        'category_id_variable_name',
        null
      ),
    ]);

    return response('', 204);
  }

  /**
   * Updates catalog listing module module
   *
   * @param Illuminate\Http\Request $request
   * @param int $moduleId
   * @return void Returns 204 or 404 when catalog listing module is not found
   */
  public function updateCatalogListingModule(Request $request, int $moduleId) {
    $this->validate($request, [
      'language_code' => 'string|nullable',
      'category_id' => 'numeric|nullable',
      'category_id_variable_name' => 'string|nullable',
    ]);

    $catalogListingModule = CatalogListingModules::catalogListingModule(
      $moduleId
    );

    if (isset($catalogListingModule)) {
      DB::table('catalog_listing_modules')
        ->where('parent_id', '=', $moduleId)
        ->update([
          'language_code' => $request->input(
            'language_code',
            $catalogListingModule->language_code
          ),
          'category_id' => $request->input(
            'category_id',
            $catalogListingModule->category_id
          ),
          'category_id_variable_name' => $request->input(
            'category_id_variable_name',
            $catalogListingModule->category_id_variable_name
          ),
        ]);

      return response('', 204);
    } else {
      return response('', 404);
    }
  }

  /**
   * Deletes catalog listing module

   * @param int $moduleId
   * @return void Returns 204 status code or 404 when catalog listing 
   *              module is not found
   */
  public function deleteCatalogListingModule(int $moduleId) {
    $catalogListingModule = CatalogListingModules::catalogListingModule(
      $moduleId
    );

    if (isset($catalogListingModule)) {
      DB::table('catalog_listing_modules')
        ->where('parent_id', '=', $moduleId)
        ->delete();

      return response('', 204);
    } else {
      return response('', 404);
    }
  }
}
