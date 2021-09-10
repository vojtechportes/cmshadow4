<?php

namespace App\Http\Controllers;

use App\CatalogCurrencies;
use App\CatalogCurrencyTaxRates;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;

class CatalogCurrencyTaxRatesController extends Controller {
  /**
   * Gets paginated list of catalog currency tax rates
   *
   * @param Illuminate\Http\Request $request
   * @param int $catalogCurrencyId
   * @return mixed Returns paginated list of catalog currency tax rates or 404 status code
   */
  public function getCatalogCurrencyTaxRates(
    Request $request,
    int $catalogCurrencyId
  ) {
    $catalogCurrency = CatalogCurrencies::catalogCurrency($catalogCurrencyId);

    if (isset($catalogCurrency)) {
      $catalogCurrencyTaxRates = CatalogCurrencyTaxRates::catalogCurrencyTaxRates(
        $catalogCurrencyId
      );

      return response()->json(
        $catalogCurrencyTaxRates->paginate(
          CatalogCurrencyTaxRates::getPageSize()
        )
      );
    } else {
      return response('', 404);
    }
  }

  /**
   * Gets list of all catalog currency tax rates
   *
   * @param Illuminate\Http\Request $request
   * @param int $catalogCurrencyId
   * @return mixed Returns list of all catalog currency tax rates or 404 status code
   */
  public function getAllCatalogCurrencyTaxRates(
    Request $request,
    $catalogCurrencyId = null
  ) {
    if ($catalogCurrencyId !== null) {
      $catalogCurrency = CatalogCurrencies::catalogCurrency($catalogCurrencyId);

      if (isset($catalogCurrency)) {
        $catalogCurrencyTaxRates = CatalogCurrencyTaxRates::catalogCurrencyTaxRates(
          $catalogCurrencyId
        )
          ->orderBy('rate', 'ASC')
          ->get();
      } else {
        return response('', 404);
      }
    } else {
      $catalogCurrencyTaxRates = CatalogCurrencyTaxRates::allCatalogCurrencyTaxRates()
        ->orderBy('currency_id', 'ASC')
        ->orderBy('rate', 'ASC')
        ->get();
    }

    return response()->json($catalogCurrencyTaxRates);
  }

  /**
   * Gets catalog currency tax rate by catalogCurrencyTaxRateId
   *
   * @param int $catalogCurrencyTaxRateId
   * @return mixed Returns catalog currency tax rate or 404 status code
   */
  public function getCatalogCurrencyTaxRate(int $catalogCurrencyTaxRateId) {
    $catalogCurrencyTaxRate = CatalogCurrencyTaxRates::catalogCurrencyTaxRate(
      $catalogCurrencyTaxRateId
    );

    if (isset($catalogCurrencyTaxRate)) {
      return response()->json($catalogCurrencyTaxRate);
    } else {
      return response('', 404);
    }
  }

  /**
   * Creates new catalog currency tax rate
   *
   * @param Illuminate\Http\Request $request
   * @param int $catalogCurrencyId
   * @return void
   */
  public function createCatalogCurrencyTaxRate(
    Request $request,
    int $catalogCurrencyId
  ) {
    $catalogCurrency = CatalogCurrencies::catalogCurrency($catalogCurrencyId);

    if (isset($catalogCurrency)) {
      $this->validate($request, [
        'rate' => 'numeric|min:0|unique:catalog_currency_tax_rates',
      ]);

      DB::table('catalog_currency_tax_rates')->insert([
        'currency_id' => $catalogCurrencyId,
        'rate' => $request->input('rate'),
      ]);

      return response('', 204);
    } else {
      return response('', 404);
    }
  }

  /**
   * Updates catalog currency tax rate
   *
   * @param Illuminate\Http\Request $request
   * @param string $catalogCurrencyId
   * @param string $catalogCurrencyTaxRateId
   * @return void Returns 204 or 404 when catalog currency tax rate is not found
   */
  public function updateCatalogCurrencyTaxRate(
    Request $request,
    int $catalogCurrencyId,
    int $catalogCurrencyTaxRateId
  ) {
    $catalogCurrency = CatalogCurrencies::catalogCurrency($catalogCurrencyId);
    $catalogCurrencyTaxRate = CatalogCurrencyTaxRates::catalogCurrencyTaxRate(
      $catalogCurrencyTaxRateId
    );

    if (isset($catalogCurrency) && isset($catalogCurrencyTaxRate)) {
      $this->validate($request, [
        'rate' => "numeric|unique:catalog_currency_tax_rates,rate,{$catalogCurrencyTaxRateId}",
      ]);

      DB::table('catalog_currency_tax_rates')
        ->where('id', '=', $catalogCurrencyTaxRateId)
        ->update([
          'rate' => $request->input('rate', $catalogCurrencyTaxRate->rate),
        ]);

      return response('', 204);
    } else {
      return response('', 404);
    }
  }

  /**
   * Deletes catalog currency tax rate

   * @param string $catalogCurrencyId
   * @param string $catalogCurrencyTaxRateId
   * @return void Returns 204 status code or 404 when catalog currency tax rate is not found
   */
  public function deleteCatalogCurrencyTaxRate(
    int $catalogCurrencyId,
    int $catalogCurrencyTaxRateId
  ) {
    $catalogCurrency = CatalogCurrencies::catalogCurrency($catalogCurrencyId);
    $catalogCurrencyTaxRate = CatalogCurrencyTaxRates::catalogCurrencyTaxRate(
      $catalogCurrencyTaxRateId
    );

    if (isset($catalogCurrency) && isset($catalogCurrencyTaxRate)) {
      DB::transaction(function () use ($catalogCurrencyTaxRateId) {
        DB::table('catalog_currency_tax_rates')
          ->where('id', '=', $catalogCurrencyTaxRateId)
          ->delete();

        // Get tax rate catalog fields
        $taxRateFields = DB::table('catalog_item_template_fields')
          ->where('type', '=', 'TAX_RATE')
          ->get();

        // Update all catalog item template field values after removing currency tax rate
        foreach ($taxRateFields as $field) {
          DB::table('catalog_item_template_field_values')
            ->where('field_id', '=', $field->id)
            ->where('value', '=', $catalogCurrencyTaxRateId)
            ->update(['value' => '']);
        }
      });

      return response('', 204);
    } else {
      return response('', 404);
    }
  }
}
