<?php

namespace App;

use App\BaseModel;
use Illuminate\Support\Facades\DB;

class NavigationItemVariableMappings extends BaseModel {
  protected function navigationItemVariableMappings(int $navigationItemId) {
    return DB::table('navigation_item_variable_mappings')
      ->where('navigation_item_id', '=', $navigationItemId)
      ->orderBy('id', 'desc');
  }

  protected function navigationItemVariableMapping(
    int $navigationItemVariableMapping
  ) {
    return DB::table('navigation_item_variable_mappings')
      ->where('id', '=', $navigationItemVariableMapping)
      ->get()
      ->first();
  }
}
