<?php

namespace App;

use App\BaseModel;
use Illuminate\Support\Facades\DB;

class CatalogCurrencyTaxRates extends BaseModel {
  protected function allCatalogCurrencyTaxRates() {
    return DB::table('catalog_currency_tax_rates');
  }

  protected function catalogCurrencyTaxRates(int $catalogCurrencyId) {
    return DB::table('catalog_currency_tax_rates')->where(
      'currency_id',
      '=',
      $catalogCurrencyId
    );
  }

  protected function catalogCurrencyTaxRate(int $catalogCurrencyTaxRateId) {
    return DB::table('catalog_currency_tax_rates')
      ->where('id', '=', $catalogCurrencyTaxRateId)
      ->get()
      ->first();
  }
}
