<?php

namespace App;

use App\BaseModel;
use Illuminate\Support\Facades\DB;

class CatalogCategoryModules extends BaseModel {
  protected function catalogCategoryModules() {
    return DB::table('catalog_category_modules');
  }

  protected function catalogCategoryModule(int $moduleId) {
    return DB::table('catalog_category_modules')
      ->where('parent_id', '=', $moduleId)
      ->get()
      ->first();
  }

  protected function insertCatalogCategoryModule(
    int $moduleId,
    $categoryId = null,
    $languageCode = null,
    $categoryIdVariableName = null,
    $loadFromGlobalContext = false
  ) {
    DB::table('catalog_category_modules')->insert([
      'parent_id' => $moduleId,
      'category_id' => $categoryId,
      'language_code' => $languageCode,
      'catalog_category_id_variable_name' => $categoryIdVariableName,
      'load_from_global_context' => $loadFromGlobalContext,
    ]);
  }
}
