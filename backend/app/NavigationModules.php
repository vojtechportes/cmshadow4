<?php

namespace App;

use App\BaseModel;
use Illuminate\Support\Facades\DB;

class NavigationModules extends BaseModel {
  protected function navigationModules() {
    return DB::table('navigation_modules');
  }

  protected function navigationModule(int $moduleId) {
    return DB::table('navigation_modules')
      ->where('parent_id', '=', $moduleId)
      ->get()
      ->first();
  }

  protected function insertNavigationModule(int $moduleId, int $navigationId) {
    DB::table('navigation_modules')->insert([
      'parent_id' => $moduleId,
      'navigation_id' => $navigationId,
    ]);
  }
}
