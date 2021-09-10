<?php

namespace App;

use App\BaseModel;
use Illuminate\Support\Facades\DB;

class CatalogCategoryTreeModules extends BaseModel {
  protected function catalogCategoryTreeModules() {
    return DB::table('catalog_category_tree_modules');
  }

  protected function catalogCategoryTreeModule(int $moduleId) {
    return DB::table('catalog_category_tree_modules')
      ->where('parent_id', '=', $moduleId)
      ->get()
      ->first();
  }

  protected function insertCatalogCategoryTreeModule(
    int $moduleId,
    $parentCategoryId = null,
    $displayIfParentCategoryId = null,
    $languageCode = null,
    $linkPattern = ''
  ) {
    DB::table('catalog_category_tree_modules')->insert([
      'parent_id' => $moduleId,
      'parent_category_id' => $parentCategoryId,
      'display_if_parent_category_id' => $displayIfParentCategoryId,
      'language_code' => $languageCode,
      'link_pattern' => $linkPattern,
    ]);
  }
}
