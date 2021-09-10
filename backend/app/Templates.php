<?php

namespace App;

use App\BaseModel;
use Illuminate\Support\Facades\DB;

class Templates extends BaseModel {
  protected function templates() {
    return DB::table('templates')->orderBy('name', 'asc');
  }

  protected function template(int $templateId) {
    return DB::table('templates')
      ->where('id', '=', $templateId)
      ->get()
      ->first();
  }

  protected function templatePages(int $templateId) {
    return DB::table('templates_pages_binding')
      ->select('template_pages.id', 'template_pages.name')
      ->where('template_id', '=', $templateId)
      ->join(
        'template_pages',
        'template_pages.id',
        '=',
        'templates_pages_binding.template_page_id'
      )
      ->get();
  }
}
