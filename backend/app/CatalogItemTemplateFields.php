<?php

namespace App;

use App\BaseModel;
use Illuminate\Support\Facades\DB;

class CatalogItemTemplateFields extends BaseModel {
  protected function catalogItemTemplateFields(int $templateId) {
    return DB::table('catalog_item_template_fields')->where(
      'template_id',
      '=',
      $templateId
    );
  }

  protected function catalogItemTemplateField(int $catalogItemTempalteFieldId) {
    return DB::table('catalog_item_template_fields')
      ->where('id', '=', $catalogItemTempalteFieldId)
      ->get()
      ->first();
  }
}
