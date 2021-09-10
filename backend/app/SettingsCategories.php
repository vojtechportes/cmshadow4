<?php

namespace App;

use App\BaseModel;
use Illuminate\Support\Facades\DB;

class SettingsCategories extends BaseModel {
  protected $mass_assignable = ['parent_id', 'key', 'weight'];
  public $timestamps = false;

  protected function settingsCategories($parentId = null) {
    return DB::table('settings_categories')
      ->where('id', '=', $parentId)
      ->orderBy('weight', 'asc');
  }

  protected function settingsCategory(int $settingsCategoryId) {
    return DB::table('settings_categories')
      ->where('id', '=', $settingsCategoryId)
      ->get()
      ->first();
  }
}
