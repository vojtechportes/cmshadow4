<?php

namespace App\Http\Controllers;

use App\CatalogCategories;
use App\CatalogLanguages;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;
use App\CatalogItemTemplateFields;

class CatalogCategoriesController extends Controller {
  /**
   * Gets list of all catalog categories
   *
   * @param Illuminate\Http\Request $request
   * @return mixed Returns list of all catalog categories
   */
  public function getCatalogCategories(Request $request) {
    $parentId = $request->input('parent_category_id', null);
    $publishedOnly = $request->input('published_only', false);
    $withDetail = $request->input('with_detail', false);
    $languageCode = $request->input('language_code');

    $data = CatalogCategories::catalogCategoryTree(
      $parentId,
      $publishedOnly,
      $withDetail,
      $languageCode
    );

    return response()->json($data);
  }

  /**
   * Gets catalog category by catalogCategoryId
   *
   * @param Illuminate\Http\Request $request
   * @param int $catalogCategoryId
   * @return mixed Returns catalog category or 404 when catalog category is not found
   */
  public function getCatalogCategory(Request $request, int $catalogCategoryId) {
    $publisedOnly = $request->input('published_only', false);
    $catalogCategory = CatalogCategories::catalogCategory(
      $catalogCategoryId,
      (bool) $publisedOnly
    );

    if (isset($catalogCategory)) {
      $values = DB::table('catalog_category_values')
        ->where('category_id', '=', $catalogCategoryId)
        ->get();

      $catalogCategory->data = (object) [];

      if (isset($values)) {
        foreach ($values as $value) {
          $catalogCategory->data->{$value->language} = [
            'name' => $value->name,
            'description' => $value->description,
          ];
        }
      }

      return response()->json($catalogCategory);
    } else {
      return response('', 404);
    }
  }

  /**
   * Creates new catalog category
   *
   * @param Illuminate\Http\Request $request
   * @return mixed Returns id of created category
   */
  public function createCatalogCategory(Request $request) {
    $catalogLanguages = CatalogLanguages::catalogLanguages()
      ->select('code')
      ->get();

    $validation = [
      'name' => 'required|max:255',
      'parent_id' => 'exists:catalog_categories,id',
      'weight' => 'numeric',
    ];

    foreach ($catalogLanguages as $language) {
      $validation["values.{$language->code}.name"] = 'string';
      $validation["values.{$language->code}.description"] = 'string';
    }

    $this->validate($request, $validation);

    $id = DB::transaction(function () use ($request, $catalogLanguages) {
      $id = DB::table('catalog_categories')->insertGetId([
        'name' => $request->input('name'),
        'parent_id' => $request->input('parent_id', null),
        'weight' => $request->input('weight', 50),
      ]);

      foreach ($catalogLanguages as $language) {
        DB::table('catalog_category_values')->insert([
          'category_id' => $id,
          'language' => $language->code,
          'name' => $request->input("values.{$language->code}.name", ''),
          'description' => $request->input(
            "values.{$language->code}.description",
            ''
          ),
        ]);
      }

      return $id;
    });

    return response()->json(['id' => $id]);
  }

  /**
   * Updates catalog category
   *
   * @param Illuminate\Http\Request $request
   * @param int $catalogCategoryId
   * @return void Returns 204 or 404 when catalog category is not found
   */
  public function updateCatalogCategory(
    Request $request,
    int $catalogCategoryId
  ) {
    $catalogCategory = CatalogCategories::catalogCategory($catalogCategoryId);

    if (isset($catalogCategory)) {
      $catalogLanguages = CatalogLanguages::catalogLanguages()
        ->select('code')
        ->get();

      $validation = [
        'name' => 'max:255',
        'parent_id' => 'exists:catalog_categories,id',
        'weight' => 'numeric',
      ];

      foreach ($catalogLanguages as $language) {
        $validation["values.{$language->code}.name"] = 'string';
        $validation["values.{$language->code}.description"] = 'string';
      }

      $this->validate($request, $validation);

      DB::transaction(function () use (
        $request,
        $catalogCategoryId,
        $catalogCategory,
        $catalogLanguages
      ) {
        DB::table('catalog_categories')
          ->where('id', '=', $catalogCategoryId)
          ->update([
            'name' => $request->input('name', $catalogCategory->name),
            'parent_id' => $request->input(
              'parent_id',
              $catalogCategory->parent_id
            ),
            'weight' => $request->input('weight', $catalogCategory->weight),
          ]);

        foreach ($catalogLanguages as $language) {
          $values = DB::table('catalog_category_values')
            ->where('category_id', '=', $catalogCategoryId)
            ->where('language', '=', $language->code)
            ->get()
            ->first();

          if (isset($values)) {
            DB::table('catalog_category_values')
              ->where('category_id', '=', $catalogCategoryId)
              ->where('language', '=', $language->code)
              ->update([
                'name' => $request->input(
                  "values.{$language->code}.name",
                  $values->name
                ),
                'description' => $request->input(
                  "values.{$language->code}.description",
                  $values->description
                ),
              ]);
          } else {
            DB::table('catalog_category_values')->insert([
              'category_id' => $catalogCategoryId,
              'language' => $language->code,
              'name' => $request->input("values.{$language->code}.name", ''),
              'description' => $request->input(
                "values.{$language->code}.description",
                ''
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

  /**
   * Publishes catalog category
   *
   * @param int $catalogCategoryId
   * @return void Returns 204 status code or 404 status code when catalog
   *              category is not found
   */
  public function publishCatalogCategory(int $catalogCategoryId) {
    $catalogCategory = CatalogCategories::catalogCategory($catalogCategoryId);

    if (isset($catalogCategory)) {
      if ($catalogCategory->published === 1) {
        return response('', 405);
      }

      $id = DB::table('catalog_categories')
        ->where('id', '=', $catalogCategoryId)
        ->update(['published' => 1]);

      return response('', 204);
    } else {
      return response('', 404);
    }
  }

  /**
   * Unpublishes catalog category
   *
   * @param int $catalogCategoryId
   * @return void Returns 204 status code or 404 status code when catalog
   *              category is not found
   */
  public function unpublishCatalogCategory(int $catalogCategoryId) {
    $catalogCategory = CatalogCategories::catalogCategory($catalogCategoryId);

    if (isset($catalogCategory)) {
      if ($catalogCategory->published === 0) {
        return response('', 405);
      }

      $id = DB::table('catalog_categories')
        ->where('id', '=', $catalogCategoryId)
        ->update(['published' => 0]);

      return response('', 204);
    } else {
      return response('', 404);
    }
  }

  /**
   * Deletes catalog category and all subordinated categories
   *
   * @param Illuminate\Http\Request $request
   * @param int $catalogCategoryId
   * @return void Returns 204 or 404 when catalog category is not found
   */
  public function deleteCatalogCategory(
    Request $request,
    string $catalogCategoryId
  ) {
    $catalogCategory = CatalogCategories::catalogCategory($catalogCategoryId);

    if (isset($catalogCategory)) {
      DB::transaction(function () use ($catalogCategory) {
        $catalogCategoryIds = CatalogCategories::getChildrenRecursive(
          $catalogCategory->id,
          'catalog_categories',
          'parent_id'
        );

        DB::table('catalog_categories')
          ->whereIn('id', $catalogCategoryIds)
          ->delete();

        DB::table('catalog_category_values')
          ->whereIn('category_id', $catalogCategoryIds)
          ->delete();

        DB::table('catalog_item_categories')
          ->whereIn('category_id', $catalogCategoryIds)
          ->delete();
      });

      return response('', 204);
    } else {
      return response('', 404);
    }
  }
}
