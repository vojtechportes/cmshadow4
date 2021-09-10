<?php

namespace App;

use App\BaseModel;
use Illuminate\Support\Facades\DB;

class CatalogSearchModules extends BaseModel {
  protected function catalogSearchModules() {
    return DB::table('catalog_search_modules');
  }

  protected function catalogSearchModule(int $moduleId) {
    return DB::table('catalog_search_modules')
      ->where('parent_id', '=', $moduleId)
      ->get()
      ->first();
  }

  protected function insertCatalogSearchModule(
    int $moduleId,
    string $searchPlaceholder,
    string $submitLabel
  ) {
    DB::table('catalog_search_modules')->insert([
      'parent_id' => $moduleId,
      'search_placeholder' => $searchPlaceholder,
      'submit_label' => $submitLabel,
    ]);
  }
}
