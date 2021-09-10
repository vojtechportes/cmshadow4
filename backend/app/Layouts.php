<?php

namespace App;

use App\BaseModel;
use Illuminate\Support\Facades\DB;

class Layouts extends BaseModel {
  protected function layouts() {
    return DB::table('layouts')->orderBy('name', 'asc');
  }

  protected function layout(int $layoutId) {
    return DB::table('layouts')
      ->where('id', '=', $layoutId)
      ->get()
      ->first();
  }
}
