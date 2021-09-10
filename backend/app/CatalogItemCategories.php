<?php

namespace App;

use App\BaseModel;
use Illuminate\Support\Facades\DB;

class CatalogItemCategories extends BaseModel {
  protected function catalogItemCategories(int $itemId) {
    return DB::table('catalog_item_categories')->where('item_id', '=', $itemId);
  }
}
