<?php

namespace App\Http\Controllers;

use App\CatalogCurrencies;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;

class CatalogCurrenciesController extends Controller {
  /**
   * Gets paginated list of catalog currencies
   *
   * @param Illuminate\Http\Request $request
   * @return mixed Returns paginated list of catalog currencies
   */
  public function getCatalogCurrencies(Request $request) {
    $catalogCurrencies = CatalogCurrencies::catalogCurrencies()->orderBy(
      'is_main',
      'DESC'
    );

    return response()->json(
      $catalogCurrencies->paginate(CatalogCurrencies::getPageSize())
    );
  }

  /**
   * Gets list of all catalog currencies
   *
   * @param Illuminate\Http\Request $request
   * @return mixed Returns list of all catalog currencies
   */
  public function getAllCatalogCurrencies(Request $request) {
    $catalogCurrencies = CatalogCurrencies::catalogCurrencies()
      ->orderBy('is_main', 'DESC')
      ->get();

    return response()->json($catalogCurrencies);
  }

  /**
   * Gets catalog currency by catalogCurrencyId
   *
   * @param int $catalogCurrencyId
   * @return mixed Return catalog currency or 404 status code
   */
  public function getCatalogCurrency(int $catalogCurrencyId) {
    $catalogCurrency = CatalogCurrencies::catalogCurrency($catalogCurrencyId);

    if (isset($catalogCurrency)) {
      return response()->json($catalogCurrency);
    } else {
      return response('', 404);
    }
  }

  /**
   * Creates new catalog currency
   *
   * @param Illuminate\Http\Request $request
   * @return void
   */
  public function createCatalogCurrency(Request $request) {
    $this->validate($request, [
      'name' => 'required|max:255|unique:catalog_currencies',
      'code' => 'required|max:255|alpha_dash|unique:catalog_currencies',
      'rate' => 'required|numeric|min:0',
      'symbol' => 'string',
      'decimal_places' => 'numeric|min:0',
      'inherits_tax_rate' => 'boolean',
      'fetch_currency_rate' => 'boolean',
    ]);

    $count = CatalogCurrencies::catalogCurrencies()->count();
    $rate = $request->input('rate');
    $isMain = 0; // User can set whether the currency is main or not only when updating

    /**
     * If there is no other currency, first created currency will be set as
     * main with rate 1
     */
    if ($count === 0) {
      $isMain = 1;
      $rate = 1;
    }

    $id = DB::table('catalog_currencies')->insertGetId([
      'name' => $request->input('name'),
      'code' => $request->input('code'),
      'rate' => $rate,
      'symbol' => $request->input('symbol', ''),
      'decimal_places' => $request->input('decimal_places', 2),
      'is_main' => $isMain,
      'inherits_tax_rate' => $request->input('inherits_tax_rate', 1),
      'fetch_currency_rate' => $request->input('fetch_currency_rate', 0),
    ]);

    return response()->json(['id' => $id]);
  }

  /**
   * Updates new catalog currency
   *
   * @param Illuminate\Http\Request $request
   * @param int $catalogCurrencyId
   * @return void
   */
  public function updateCatalogCurrency(
    Request $request,
    int $catalogCurrencyId
  ) {
    $catalogCurrency = CatalogCurrencies::catalogCurrency($catalogCurrencyId);

    $this->validate($request, [
      'name' => "max:255|unique:catalog_currencies,name,{$catalogCurrencyId}",
      'code' => "max:255|alpha_dash|unique:catalog_currencies,code,{$catalogCurrencyId}",
      'symbol' => 'string',
      'rate' => 'numeric|min:0',
      'decimal_places' => 'numeric|min:0',
      'is_main' => 'boolean',
      'inherits_tax_rate' => 'boolean',
      'fetch_currency_rate' => 'boolean',
    ]);

    if (isset($catalogCurrency)) {
      DB::transaction(function () use (
        $catalogCurrencyId,
        $catalogCurrency,
        $request
      ) {
        $count = CatalogCurrencies::catalogCurrencies()->count();
        $isMain = (int) $request->input('is_main', $catalogCurrency->is_main);
        $rate = $request->input('rate', $catalogCurrency->rate);
        $decimalPlaces = $request->input(
          'decimal_places',
          $catalogCurrency->decimal_places
        );

        if ($count === 0) {
          $isMain = 1;
          $rate = 1;
        } else {
          if ($catalogCurrency->is_main === 0 && $isMain === 1) {
            $rate = 1;

            $currencies = DB::table('catalog_currencies')
              ->where('id', '!=', $catalogCurrencyId)
              ->get();

            // Update currency rates by currentCurrency / currencyRate
            foreach ($currencies as $currency) {
              $newRate = $catalogCurrency->rate / $currency->rate;

              DB::table('catalog_currencies')
                ->where('id', '=', $currency->id)
                ->update([
                  'rate' => $newRate,
                ]);
            }

            /**
             * Update non multilingual price fields (multilingual ones needs to be
             * update by user since they don't need to follow price derived from
             * currency rate
             */

            $currencyFields = DB::table('catalog_item_template_fields')
              ->where('type', '=', 'PRICE')
              ->where('is_multilingual', '=', 0)
              ->get();

            foreach ($currencyFields as $currencyField) {
              DB::table('catalog_item_template_field_values')
                ->where('field_id', '=', $currencyField->id)
                ->where('language', '=', null)
                ->update([
                  'value' => DB::raw(
                    "ROUND(value * {$catalogCurrency->rate}, {$decimalPlaces})"
                  ),
                ]);
            }

            /**
             * After all catalog field values and currencies are updated,
             * change last main currency to non-main
             */
            DB::table('catalog_currencies')
              ->where('is_main', '=', 1)
              ->update([
                'is_main' => 0,
              ]);

            /**
             * Update current currency
             */
            DB::table('catalog_currencies')
              ->where('id', '=', $catalogCurrencyId)
              ->update([
                'name' => $request->input('name', $catalogCurrency->name),
                'code' => $request->input('code', $catalogCurrency->code),
                'symbol' => $request->input('symbol', $catalogCurrency->symbol),
                'rate' => $rate,
                'is_main' => 1,
                'decimal_places' => $decimalPlaces,
                'inherits_tax_rate' => 0, // Change inheritance to false. Main currency can't inherit
                'fetch_currency_rate' => $request->input(
                  'fetch_currency_rate',
                  $catalogCurrency->fetch_currency_rate
                ),
              ]);
          } elseif ($catalogCurrency->is_main === $isMain) {
            DB::table('catalog_currencies')
              ->where('id', '=', $catalogCurrencyId)
              ->update([
                'name' => $request->input('name', $catalogCurrency->name),
                'code' => $request->input('code', $catalogCurrency->code),
                'symbol' => $request->input('symbol', $catalogCurrency->symbol),
                'rate' => $rate,
                'decimal_places' => $decimalPlaces,
                'inherits_tax_rate' => $request->input(
                  'inherits_tax_rate',
                  $catalogCurrency->inherits_tax_rate
                ),
                'fetch_currency_rate' => $request->input(
                  'fetch_currency_rate',
                  $catalogCurrency->fetch_currency_rate
                ),
              ]);
          }
        }
      });

      return response('', 204);
    } else {
      return response('', 404);
    }
  }
}
