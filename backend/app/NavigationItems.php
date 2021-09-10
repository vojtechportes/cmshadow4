<?php

namespace App;

use App\BaseModel;
use Illuminate\Support\Facades\DB;

class NavigationItems extends BaseModel {
  protected function navigationItems(int $navigationId) {
    return DB::table('navigation_items')
      ->where('navigation_id', '=', $navigationId)
      ->orderBy('weight', 'asc');
  }

  protected function navigationItem(int $navigationItemId) {
    return DB::table('navigation_items')
      ->where('id', '=', $navigationItemId)
      ->get()
      ->first();
  }
}
