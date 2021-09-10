<?php

namespace App;

use App\BaseModel;
use Illuminate\Support\Facades\DB;

class Buttons extends BaseModel {
  protected function buttons() {
    return DB::table('buttons')->orderBy('id', 'desc');
  }

  protected function button(int $buttonId) {
    return DB::table('buttons')
      ->where('id', '=', $buttonId)
      ->get()
      ->first();
  }
}
