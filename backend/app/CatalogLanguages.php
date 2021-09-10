<?php

namespace App;

use App\BaseModel;
use Illuminate\Support\Facades\DB;

class CatalogLanguages extends BaseModel {
  protected $mass_assignable = ['name', 'path'];
  public $timestamps = false;

  protected function catalogLanguages() {
    return DB::table('catalog_languages')->orderBy('name', 'asc');
  }

  protected function catalogLanguage(string $languageCode) {
    return DB::table('catalog_languages')
      ->where('code', '=', $languageCode)
      ->get()
      ->first();
  }
}
