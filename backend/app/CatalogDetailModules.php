<?php

namespace App;

use App\BaseModel;
use Illuminate\Support\Facades\DB;

class CatalogDetailModules extends BaseModel {
  protected function catalogDetailModules() {
    return DB::table('catalog_detail_modules');
  }

  protected function catalogDetailModule(int $moduleId) {
    return DB::table('catalog_detail_modules')
      ->where('parent_id', '=', $moduleId)
      ->get()
      ->first();
  }

  protected function insertCatalogDetailModule(
    int $moduleId,
    $catalogItemId = null,
    $languageCode = null,
    $catalogItemIdVariableName = null,
    $loadFromGlobalContext = false
  ) {
    DB::table('catalog_detail_modules')->insert([
      'parent_id' => $moduleId,
      'catalog_item_id' => $catalogItemId,
      'language_code' => $languageCode,
      'catalog_item_id_variable_name' => $catalogItemIdVariableName,
      'load_from_global_context' => $loadFromGlobalContext,
    ]);
  }
}
