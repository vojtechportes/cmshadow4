<?php

namespace App;

use App\BaseModel;
use Illuminate\Support\Facades\DB;

class CatalogListingModules extends BaseModel {
  protected function catalogListingModules() {
    return DB::table('catalog_listing_modules');
  }

  protected function catalogListingModule(int $moduleId) {
    return DB::table('catalog_listing_modules')
      ->where('parent_id', '=', $moduleId)
      ->get()
      ->first();
  }

  protected function insertCatalogListingModule(
    int $moduleId,
    $language_code,
    $category_id,
    $category_id_variable_name
  ) {
    // TODO implement some type checking

    DB::table('catalog_listing_modules')->insert([
      'parent_id' => $moduleId,
      'language_code' => $language_code,
      'category_id' => $category_id,
      'category_id_variable_name' => $category_id_variable_name,
    ]);
  }
}
