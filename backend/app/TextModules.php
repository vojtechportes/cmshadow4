<?php

namespace App;

use App\BaseModel;
use Illuminate\Support\Facades\DB;

class TextModules extends BaseModel {
  protected function textModules() {
    return DB::table('text_modules');
  }

  protected function textModule(int $moduleId) {
    return DB::table('text_modules')
      ->where('parent_id', '=', $moduleId)
      ->get()
      ->first();
  }

  protected function insertTextModule(int $moduleId, string $content) {
    DB::table('text_modules')->insert([
      'parent_id' => $moduleId,
      'content' => $content,
    ]);
  }
}
