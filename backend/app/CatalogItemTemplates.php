<?php

namespace App;

use App\BaseModel;
use Illuminate\Support\Facades\DB;

class CatalogItemTemplates extends BaseModel {
  protected function catalogItemTemplates() {
    return DB::table('catalog_item_templates');
  }

  protected function catalogItemTemplate(int $catalogItemTemplatId) {
    return DB::table('catalog_item_templates')
      ->where('id', '=', $catalogItemTemplatId)
      ->get()
      ->first();
  }
}
