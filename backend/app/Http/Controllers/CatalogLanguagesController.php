<?php

namespace App\Http\Controllers;

use App\CatalogLanguages;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;

class CatalogLanguagesController extends Controller {
  /**
   * Gets paginated list of catalog languages
   *
   * @return mixed Returns paginated list of catalog languages
   */
  public function getCatalogLanguages() {
    $catalogLanguages = CatalogLanguages::catalogLanguages()->paginate(
      CatalogLanguages::getPageSize()
    );

    return response()->json($catalogLanguages);
  }

  /**
   * Gets list of all catalog languages
   *
   * @return mixed Returns list of all catalog languages
   */
  public function getAllCatalogLanguages() {
    $catalogLanguages = CatalogLanguages::catalogLanguages()->get();

    return response()->json($catalogLanguages);
  }

  /**
   * Gets catalog language by language code
   *
   * @param int $code
   * @return mixed Returns catalog language or 404 status code when catalog language is not found
   */
  public function getCatalogLanguage(string $code) {
    $catalogLanguage = CatalogLanguages::catalogLanguage($code);

    if (isset($catalogLanguage)) {
      return response()->json($catalogLanguage);
    } else {
      return response('', 404);
    }
  }

  /**
   * Creates new catalog language
   *
   * @param Illuminate\Http\Request $request
   * @return void
   */
  public function createCatalogLanguage(Request $request) {
    $this->validate($request, [
      'name' => 'required|max:255|unique:catalog_languages',
      'code' => 'required|max:255|alpha_dash|unique:catalog_languages',
      'default_currency_id' => 'numeric|exists:catalog_currencies,id',
    ]);

    DB::table('catalog_languages')->insert([
      'name' => $request->input('name'),
      'code' => $request->input('code'),
      'default_currency_id' => $request->input('default_currency_id', null),
    ]);

    return response('', 204);
  }

  /**
   * Updates catalog language
   *
   * @param Illuminate\Http\Request $request
   * @param string $code
   * @return void Returns 204 or 404 when catalog language is not found
   */
  public function updateCatalogLanguage(Request $request, string $code) {
    $catalogLanguage = CatalogLanguages::catalogLanguage($code);

    if (isset($catalogLanguage)) {
      $this->validate($request, [
        'name' => "max:255|unique:catalog_languages,name,{$catalogLanguage->name},name",
        'code' => "max:255|alpha_dash|unique:catalog_languages,code,{$catalogLanguage->code},code",
        'default_currency_id' => 'numeric|exists:catalog_currencies,id',
      ]);

      DB::table('catalog_languages')
        ->where('code', '=', $code)
        ->update([
          'name' => $request->input('name', $catalogLanguage->name),
          'code' => $request->input('code', $catalogLanguage->code),
          'default_currency_id' => $request->input(
            'default_currency_id',
            $catalogLanguage->default_currency_id
          ),
        ]);

      return response('', 204);
    } else {
      return response('', 404);
    }
  }

  /**
   * Deletes catalog language and all related template field values

   * @param string $code
   * @return void Returns 204 status code or 404 when catalog language is not found
   */
  public function deleteCatalogLanguage(string $code) {
    $catalogLanguage = CatalogLanguages::catalogLanguage($code);

    if (isset($catalogLanguage)) {
      DB::transaction(function () use ($code) {
        DB::table('catalog_languages')
          ->where('code', '=', $code)
          ->delete();

        DB::table('catalog_item_template_field_values')
          ->where('language', '=', $code)
          ->delete();

        DB::table('catalog_category_values')
          ->where('language', '=', $code)
          ->delete();
      });

      return response('', 204);
    } else {
      return response('', 404);
    }
  }
}
