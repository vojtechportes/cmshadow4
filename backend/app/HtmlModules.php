<?php

namespace App;

use App\BaseModel;
use Illuminate\Support\Facades\DB;

class HtmlModules extends BaseModel {
  protected function htmlModules() {
    return DB::table('html_modules');
  }

  protected function htmlModule(int $moduleId) {
    return DB::table('html_modules')
      ->where('parent_id', '=', $moduleId)
      ->get()
      ->first();
  }

  protected function insertHtmlModule(int $moduleId, string $content) {
    DB::table('html_modules')->insert([
      'parent_id' => $moduleId,
      'content' => $content,
    ]);
  }
}
