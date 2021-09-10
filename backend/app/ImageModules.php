<?php

namespace App;

use App\BaseModel;
use Illuminate\Support\Facades\DB;

class ImageModules extends BaseModel {
  protected function imageModules() {
    return DB::table('image_modules');
  }

  protected function imageModule(int $moduleId) {
    return DB::table('image_modules')
      ->where('parent_id', '=', $moduleId)
      ->get()
      ->first();
  }

  protected function insertImageModule(
    int $moduleId,
    string $file_name,
    string $image_alt
  ) {
    DB::table('image_modules')->insert([
      'parent_id' => $moduleId,
      'file_name' => $file_name,
      'image_alt' => $image_alt,
    ]);
  }
}
