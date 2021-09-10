<?php

namespace App;

use App\BaseModel;
use Illuminate\Support\Facades\DB;

class Settings extends BaseModel {
  protected $mass_assignable = [
    'category_id',
    'key',
    'options',
    'value_type',
    'value',
    'weight',
  ];
  public $timestamps = false;

  protected function settings($categoryId = null) {
    return DB::table('settings')
      ->where('category_id', '=', $categoryId)
      ->orderBy('weight', 'asc');
  }

  protected function setting(int $settingId) {
    return DB::table('settings')
      ->where('id', '=', $settingId)
      ->get()
      ->first();
  }
}
