<?php

namespace App\Http\Controllers;

use App\CatalogItems;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;
use App\CatalogItemTemplateFields;

class CatalogItemsController extends Controller {
  /**
   * Gets paginated list of catalog items
   *
   * @param Illuminate\Http\Request $request
   * @return mixed Returns paginated list of catalog items
   */
  public function getCatalogItems(Request $request) {
    $this->validate($request, [
      'category.*' => 'numeric',
      'name' => 'string|max:255',
      'sku' => 'string|max:255',
    ]);

    $catalogItems = CatalogItems::catalogItems();

    $categories = $request->input('category', []);
    $name = $request->input('name', false);
    $sku = $request->input('sku', false);

    if (count($categories) > 0) {
      $catalogItems
        ->leftJoin(
          'catalog_item_categories',
          'catalog_items.id',
          '=',
          'catalog_item_categories.item_id'
        )
        ->whereIn('catalog_item_categories.category_id', $categories)
        ->groupBy('catalog_items.id');
    }

    if ($name) {
      /**
       * If name request input exists, join catalog_item_template_field_values as FieldNameValues
       * and search for name in FieldName.value
       */
      $catalogItems
        ->leftJoin('catalog_item_template_fields as FieldsName', function (
          $join
        ) {
          $join
            ->on('FieldsName.template_id', '=', 'catalog_items.template_id')
            ->where('FieldsName.key', '=', SETTINGS_CATALOG_NAME_FIELD);
        })
        ->leftJoin(
          'catalog_item_template_field_values as FieldNameValues',
          function ($join) {
            $join->on('FieldNameValues.item_id', '=', 'catalog_items.id');
            $join->on('FieldsName.id', '=', 'FieldNameValues.field_id');
          }
        )
        ->where('FieldNameValues.value', 'like', "%{$name}%")
        ->groupBy('catalog_items.id');
    }

    if ($sku) {
      /**
       * If sku request input exists, join catalog_item_template_field_values as FieldSkuValues
       * and search for name in FieldSku.value
       */
      $catalogItems
        ->leftJoin('catalog_item_template_fields as FieldsSku', function (
          $join
        ) {
          $join
            ->on('FieldsSku.template_id', '=', 'catalog_items.template_id')
            ->where('FieldsSku.key', '=', SETTINGS_CATALOG_SKU_FIELD);
        })
        ->leftJoin(
          'catalog_item_template_field_values as FieldSkuValues',
          function ($join) {
            $join->on('FieldSkuValues.item_id', '=', 'catalog_items.id');
            $join->on('FieldsSku.id', '=', 'FieldSkuValues.field_id');
          }
        )
        ->where('FieldSkuValues.value', 'like', "%{$sku}%");
    }

    /**
     * Add name, description and image field values
     * to catalog items select as columns
     */
    foreach (
      [
        SETTINGS_CATALOG_NAME_FIELD,
        SETTINGS_CATALOG_SKU_FIELD,
        SETTINGS_CATALOG_DESCRIPTION_FIELD,
        SETTINGS_CATALOG_IMAGE_FIELD,
      ]
      as $field
    ) {
      $fieldName = '';

      switch ($field) {
        case SETTINGS_CATALOG_NAME_FIELD:
          $fieldName = 'name';
          break;
        case SETTINGS_CATALOG_SKU_FIELD:
          $fieldName = 'sku';
          break;
        case SETTINGS_CATALOG_DESCRIPTION_FIELD:
          $fieldName = 'description';
          break;
        case SETTINGS_CATALOG_IMAGE_FIELD:
          $fieldName = 'image';
          break;
      }

      $catalogItems->addSelect(
        DB::raw(
          "(" .
            "SELECT catalog_item_template_field_values.value AS field_{$fieldName}_value " .
            "FROM catalog_item_template_fields " .
            "LEFT JOIN catalog_item_template_field_values " .
            "ON catalog_item_template_field_values.field_id = catalog_item_template_fields.id " .
            "WHERE catalog_item_template_field_values.item_id = catalog_items.id " .
            "AND catalog_item_template_fields.template_id = catalog_items.template_id " .
            "AND catalog_item_template_fields.key = \"{$field}\" LIMIT 1 " .
            ") AS field_{$fieldName}_value "
        )
      );
    }
    return response()->json(
      $catalogItems->paginate(CatalogItems::getPageSize())
    );
  }

  /**
   * Gets paginated list of catalog items
   *
   * @param Illuminate\Http\Request $request
   * @return mixed Returns paginated list of catalog items
   */
  public function getPublicCatalogItems(Request $request) {
    $pageSize = $request->input('page_size', 20);
    $languageCode = $request->input('language_code');
    $parentId = $request->input('parent_id');
    $sortFields = CatalogItems::getSortFields($request);

    $catalogItems = CatalogItems::publicCatalogItemListing(
      $languageCode,
      $parentId,
      $pageSize,
      $sortFields
    );

    return response()->json($catalogItems);
  }

  /**
   * Gets catalog item by catalog item id
   *
   * @param int $catalogItemId
   * @return mixed Returns catalog item or 404 status code when catalog item is not found
   */
  public function getCatalogItem(int $catalogItemId) {
    $catalogItem = CatalogItems::catalogItemDetail($catalogItemId);

    if (isset($catalogItem)) {
      return response()->json($catalogItem);
    } else {
      return response('', 404);
    }
  }

  public function getPublicCatalogItem(Request $request, int $catalogItemId) {
    $this->validate($request, [
      'language' => 'string',
      'is_listing' => 'boolean',
    ]);

    $language = $request->input('language', null);
    $isListing = $request->input('is_listing', false);

    $catalogItem = CatalogItems::publicCatalogItem(
      $catalogItemId,
      $language,
      $isListing
    );

    if (isset($catalogItem)) {
      return response()->json($catalogItem);
    } else {
      return response('', 404);
    }
  }

  /**
   * Creates new catalog item
   *
   * @param Illuminate\Http\Request $request
   * @return mixed Returns id of created catalog item
   */
  public function createCatalogItem(Request $request) {
    $this->validate($request, [
      'template_id' => 'required|numeric|exists:catalog_item_templates,id',
    ]);

    $id = DB::table('catalog_items')->insertGetId([
      'template_id' => $request->input('template_id'),
    ]);

    return response()->json(['id' => $id]);
  }

  /**
   * Updates catalog item
   *
   * @param Illuminate\Http\Request $request
   * @param int $catalogItemId
   * @return void Returns 204 status code or 404 status code when catalog
   *              item is not found
   */
  public function updateCatalogItem(Request $request, int $catalogItemId) {
    $catalogItem = CatalogItems::catalogItem($catalogItemId);

    if (isset($catalogItem)) {
      $this->validate($request, [
        'template_id' => 'numeric|exists:catalog_templates,id',
      ]);

      $id = DB::table('catalog_items')
        ->where('id', '=', $catalogItemId)
        ->update([
          'template_id' => $request->input(
            'template_id',
            $catalogItem->template_id
          ),
          'modified_at' => date('Y-m-d H:i:s'),
          'published_at' => (bool) $catalogItem->published
            ? date('Y-m-d H:i:s')
            : ($catalogItem->published
              ? $catalogItem->published
              : null),
        ]);

      return response('', 204);
    } else {
      return response('', 404);
    }
  }

  /**
   * Publishes catalog item
   *
   * @param int $catalogItemId
   * @return void Returns 204 status code or 404 status code when catalog
   *              item is not found
   */
  public function publishCatalogItem(int $catalogItemId) {
    $catalogItem = CatalogItems::catalogItem($catalogItemId);

    if (isset($catalogItem)) {
      if ($catalogItem->published === 1) {
        return response('', 405);
      }

      $id = DB::table('catalog_items')
        ->where('id', '=', $catalogItemId)
        ->update(['published' => 1, 'published_at' => date('Y-m-d H:i:s')]);

      return response('', 204);
    } else {
      return response('', 404);
    }
  }

  /**
   * Unpublishes catalog item
   *
   * @param int $catalogItemId
   * @return void Returns 204 status code or 404 status code when catalog
   *              item is not found
   */
  public function unpublishCatalogItem(int $catalogItemId) {
    $catalogItem = CatalogItems::catalogItem($catalogItemId);

    if (isset($catalogItem)) {
      if ($catalogItem->published === 0) {
        return response('', 405);
      }

      $id = DB::table('catalog_items')
        ->where('id', '=', $catalogItemId)
        ->update(['published' => 0, 'published_at' => null]);

      return response('', 204);
    } else {
      return response('', 404);
    }
  }

  /**
   * Books catalog item
   *
   * @param int $catalogItemId
   * @return void Returns 204 status code or 404 status code when catalog
   *              item is not found
   */
  public function bookCatalogItem(int $catalogItemId) {
    $catalogItem = CatalogItems::catalogItem($catalogItemId);

    if (isset($catalogItem)) {
      if ($catalogItem->booked === 1) {
        return response('', 405);
      }

      $id = DB::table('catalog_items')
        ->where('id', '=', $catalogItemId)
        ->update(['booked' => 1, 'modified_at' => date('Y-m-d H:i:s')]);

      return response('', 204);
    } else {
      return response('', 404);
    }
  }

  /**
   * Unbooks catalog item
   *
   * @param int $catalogItemId
   * @return void Returns 204 status code or 404 status code when catalog
   *              item is not found
   */
  public function unbookCatalogItem(int $catalogItemId) {
    $catalogItem = CatalogItems::catalogItem($catalogItemId);

    if (isset($catalogItem)) {
      if ($catalogItem->booked === 0) {
        return response('', 405);
      }

      $id = DB::table('catalog_items')
        ->where('id', '=', $catalogItemId)
        ->update(['booked' => 0, 'modified_at' => date('Y-m-d H:i:s')]);

      return response('', 204);
    } else {
      return response('', 404);
    }
  }

  /**
   * Deletes catalog item and its fields
   *
   * @param int $catalogItemId
   * @return void Returns 204 status code or 404 status code when catalog
   *              item is not found
   */
  public function deleteCatalogItem(int $catalogItemId) {
    $catalogItem = CatalogItems::catalogItem($catalogItemId);

    if (isset($catalogItem)) {
      DB::table('catalog_items')
        ->where('id', '=', $catalogItemId)
        ->delete();

      DB::table('catalog_item_template_field_values')
        ->where('item_id', '=', $catalogItemId)
        ->delete();

      // TODO delete images and gallery images if present

      return response('', 204);
    } else {
      return response('', 404);
    }
  }
}
