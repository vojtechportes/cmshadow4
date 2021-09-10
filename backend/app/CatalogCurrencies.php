<?php

namespace App;

use App\BaseModel;
use Illuminate\Support\Facades\DB;

class CatalogCurrencies extends BaseModel {
  protected function catalogCurrencies() {
    return DB::table('catalog_currencies');
  }

  protected function catalogCurrency(int $catalogCurrencyId) {
    return DB::table('catalog_currencies')
      ->where('id', '=', $catalogCurrencyId)
      ->get()
      ->first();
  }

  protected function catalogCurrencyByLanguageCode(
    string $catalogCurrencyLanguageCode
  ) {
    return DB::table('catalog_languages')
      ->select('catalog_currencies.*')
      ->leftJoin(
        'catalog_currencies',
        'catalog_languages.default_currency_id',
        'catalog_currencies.id'
      )
      ->where('catalog_languages.code', '=', $catalogCurrencyLanguageCode)
      ->get()
      ->first();
  }
}
