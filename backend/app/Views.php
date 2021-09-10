<?php

namespace App;

use App\BaseModel;
use Illuminate\Support\Facades\DB;

class Views extends BaseModel {
  protected $mass_assignable = ['name', 'path'];
  public $timestamps = false;

  protected function views() {
    return DB::table('views')->orderBy('name', 'asc');
  }

  protected function view(int $viewId) {
    return DB::table('views')
      ->where('id', '=', $viewId)
      ->get()
      ->first();
  }
}
