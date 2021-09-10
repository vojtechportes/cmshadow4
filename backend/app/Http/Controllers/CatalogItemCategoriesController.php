<?php

namespace App\Http\Controllers;

use App\CatalogItemCategories;
use App\CatalogItems;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;

class CatalogItemCategoriesController extends Controller {
  /**
   * Gets list of catalog item categories
   *
   * @param int $catalogItemId
   * @return mixed Returns list of catalo item categories
   */
  public function getCatalogItemCategories(int $catalogItemId) {
    $categories = [];

    $catalogCategories = CatalogItemCategories::catalogItemCategories(
      $catalogItemId
    )
      ->select('category_id')
      ->get();

    foreach ($catalogCategories as $category) {
      array_push($categories, $category->category_id);
    }

    return response()->json($categories);
  }

  /**
   * Sets catalog item categories
   *
   * @param Illuminate\Http\Request $request
   * @param int $catalogItemId
   * @return mixed Returns 204 status code or 404 status code when catalog
   *               item is not found
   */
  public function setCatalogItemCategories(
    Request $request,
    int $catalogItemId
  ) {
    $this->validate($request, [
      'category.*' => 'numeric|exists:catalog_categories,id',
    ]);

    $catalogItem = CatalogItems::catalogItem($catalogItemId);

    if (isset($catalogItem)) {
      $catalogCategoryIds = $request->input('category', []);
      $data = [];

      foreach ($catalogCategoryIds as $category) {
        array_push($data, [
          'item_id' => $catalogItemId,
          'category_id' => $category,
        ]);
      }

      DB::transaction(function () use ($catalogItemId, $data) {
        DB::table('catalog_item_categories')
          ->where('item_id', '=', $catalogItemId)
          ->delete();

        DB::table('catalog_item_categories')->insert($data);
      });

      return response('', 204);
    } else {
      return response('', 404);
    }
  }
}
