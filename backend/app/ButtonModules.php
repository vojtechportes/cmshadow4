<?php

namespace App;

use App\BaseModel;
use Illuminate\Support\Facades\DB;

class ButtonModules extends BaseModel {
  protected function buttonModules() {
    return DB::table('button_modules');
  }

  protected function buttonModule(int $moduleId) {
    return DB::table('button_modules')
      ->where('parent_id', '=', $moduleId)
      ->get()
      ->first();
  }

  protected function insertButtonModule(
    int $moduleId,
    string $text,
    string $path,
    string $target,
    int $buttonId
  ) {
    DB::table('button_modules')->insert([
      'parent_id' => $moduleId,
      'text' => $text,
      'path' => $path,
      'target' => $target,
      'button_id' => $buttonId,
    ]);
  }
}
