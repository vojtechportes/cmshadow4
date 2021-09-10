<?php

namespace App;

use App\BaseModel;
use Illuminate\Support\Facades\DB;

class TemplatePages extends BaseModel {
  protected function templatePages() {
    return DB::table('template_pages')->orderBy('name', 'asc');
  }

  protected function templatePage(int $templatePageId) {
    return DB::table('template_pages')
      ->where('id', '=', $templatePageId)
      ->get()
      ->first();
  }
}
