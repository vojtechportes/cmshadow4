<?php

namespace App\Http\Controllers;

use App\CatalogCategoryModules;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;

class CatalogCategoryModulesController extends Controller {
  /**
   * Gets paginated list of catalog category modules
   *
   * @return mixed Returns paginated list of catalog category modules
   */
  public function getCatalogCategoryModules() {
    $catalogCategoryModules = CatalogCategoryModules::catalogCategoryModules()->paginate(
      CatalogCategoryModules::getPageSize()
    );

    return response()->json($catalogCategoryModules);
  }

  /**
   * Gets catalog category module by moduleId
   *
   * @param int $moduleId
   * @return mixed Returns catalog category module or 404 status code when catalog category module is not found
   */
  public function getCatalogCategoryModule(int $moduleId) {
    $catalogCategoryModule = CatalogCategoryModules::catalogCategoryModule(
      $moduleId
    );

    if (isset($catalogCategoryModule)) {
      return response()->json($catalogCategoryModule);
    } else {
      return response('', 404);
    }
  }

  /**
   * Creates new catalog category module
   *
   * @param Illuminate\Http\Request $request
   * @return void
   */
  public function createCatalogCategoryModule(Request $request) {
    $this->validate($request, [
      'parent_id' => 'required|numeric',
      'category_id' => 'numeric|nullable',
      'language_code' => 'string|nullable',
      'category_id_variable_name' => 'string|nullable',
      'load_from_global_context' => 'boolean',
    ]);

    DB::table('catalog_category_modules')->insert([
      'parent_id' => $request->input('parent_id'),
      'category_id' => $request->input('category_id', null),
      'language_code' => $request->input('language_code', null),
      'category_id_variable_name' => $request->input(
        'category_id_variable_name',
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
   * Updates catalog category module
   *
   * @param Illuminate\Http\Request $request
   * @param int $moduleId
   * @return void Returns 204 or 404 when catalog category module is not found
   */
  public function updateCatalogCategoryModule(Request $request, int $moduleId) {
    $catalogCategoryModule = CatalogCategoryModules::catalogCategoryModule(
      $moduleId
    );

    $this->validate($request, [
      'category_id' => 'numeric',
      'language_code' => 'string|nullable',
      'category_id_variable_name' => 'string|nullable',
      'load_from_global_context' => 'boolean',
    ]);

    if (isset($catalogCategoryModule)) {
      $categoryId = $request->input(
        'category_id',
        $catalogCategoryModule->category_id
      );
      $categoryIdVariableName = $request->input(
        'category_id_variable_name',
        $catalogCategoryModule->category_id_variable_name
      );
      $languageCode = $request->input(
        'language_code',
        $catalogCategoryModule->language_code
      );

      DB::table('catalog_category_modules')
        ->where('parent_id', '=', $moduleId)
        ->update([
          'parent_id' => $moduleId,
          'category_id' => $categoryId === '' ? null : $categoryId,
          'language_code' => $languageCode === '' ? null : $languageCode,
          'category_id_variable_name' =>
            $categoryIdVariableName === '' ? null : $categoryIdVariableName,
          'load_from_global_context' => $request->input(
            'load_from_global_context',
            $catalogCategoryModule->load_from_global_context
          ),
        ]);

      return response('', 204);
    } else {
      return response('', 404);
    }
  }

  /**
   * Deletes catalog category module

   * @param int $moduleId
   * @return void Returns 204 status code or 404 when catalog category module is not found
   */
  public function deleteCatalogCategoryModule(int $moduleId) {
    $catalogCategoryModule = CatalogCategoryModules::catalogCategoryModule(
      $moduleId
    );

    if (isset($catalogCategoryModule)) {
      DB::table('catalog_category_modules')
        ->where('parent_id', '=', $moduleId)
        ->delete();

      return response('', 204);
    } else {
      return response('', 404);
    }
  }
}
