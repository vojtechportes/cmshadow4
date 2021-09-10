<?php

namespace App;

use App\BaseModel;
use Illuminate\Support\Facades\DB;

class Modules extends BaseModel {
  protected function modules(
    string $pageIdentifier,
    int $pageVersion,
    int $layoutId,
    array $templatePageIds = []
  ) {
    return DB::table('modules')
      ->where('page_identifier', '=', $pageIdentifier)
      ->where('page_version', '=', $pageVersion)
      ->where('layout_id', '=', $layoutId)
      ->orWhereIn('template_page_id', $templatePageIds)
      ->orderBy('slot_id')
      ->orderBy('weight');
  }

  protected function module(int $moduleId) {
    return DB::table('modules')
      ->where('id', '=', $moduleId)
      ->get()
      ->first();
  }
}
