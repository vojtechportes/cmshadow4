<?php

namespace App;

use App\BaseModel;
use Illuminate\Support\Facades\DB;

class HeadingModules extends BaseModel {
  protected function headingModules() {
    return DB::table('heading_modules');
  }

  protected function headingModule(int $moduleId) {
    return DB::table('heading_modules')
      ->where('parent_id', '=', $moduleId)
      ->get()
      ->first();
  }

  protected function insertHeadingModule(
    int $moduleId,
    int $level,
    string $content
  ) {
    DB::table('heading_modules')->insert([
      'parent_id' => $moduleId,
      'level' => $level,
      'content' => $content,
    ]);
  }
}
