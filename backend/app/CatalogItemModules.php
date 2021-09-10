<?php

namespace App;

use App\BaseModel;
use Illuminate\Support\Facades\DB;

class CatalogItemModules extends BaseModel {
  protected function catalogItemModules() {
    return DB::table('catalog_item_modules');
  }

  protected function catalogItemModule(int $moduleId) {
    return DB::table('catalog_item_modules')
      ->where('parent_id', '=', $moduleId)
      ->get()
      ->first();
  }

  protected function insertCatalogItemModule(
    int $moduleId,
    int $catalogItemId,
    $languageCode = null
  ) {
    DB::table('catalog_item_modules')->insert([
      'parent_id' => $moduleId,
      'catalog_item_id' => $catalogItemId,
      'language_code' => $languageCode,
    ]);
  }
}
