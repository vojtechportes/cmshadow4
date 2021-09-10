<?php

namespace App;

use App\BaseModel;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CatalogItems extends BaseModel {
  /**
   * Accepts sort_fields input from request in
   * format "{field_id}:{direction},{field_id}:{direction}..."
   *
   * @param Illuminate\Http\Request $request
   * @return array Empty array or array of sortable fields
   *               in format [
   *                            field_id => {field_id},
   *                            direction => {direction}...
   *                         ]
   */
  protected function getSortFields(Request $request) {
    $sortFields = $request->input('sort_fields', null);
    $fields = [];

    if ($sortFields !== null) {
      $explodedFields = explode(',', $sortFields);

      foreach ($explodedFields as $explodedField) {
        $values = explode(':', $explodedField);

        array_push($fields, [
          'field_id' => $values[0],
          'direction' => $values[1],
        ]);
      }

      return $fields;
    }

    return [];
  }

  protected function catalogItems(
    array $sortFields = [],
    $language = null,
    $parentCategoryId = null,
    bool $publishedOnly = false,
    $search = null,
    $priceFrom = null,
    $priceTo = null
  ) {
    $catalogCategoryIds = [];

    if ($parentCategoryId !== null) {
      $catalogCategoryIds = $this->getChildrenRecursive(
        $parentCategoryId,
        'catalog_categories',
        'parent_id'
      );
    }

    $items = DB::table('catalog_items')->select([
      'catalog_items.id',
      'catalog_items.template_id',
      'catalog_items.created_at',
      'catalog_items.modified_at',
      'catalog_items.created_by',
      'catalog_items.modified_by',
      'catalog_items.published',
      'catalog_items.booked',
      'catalog_items.published_at',
    ]);

    if ($parentCategoryId !== null) {
      $items
        ->leftJoin('catalog_item_categories', function ($join) use (
          $catalogCategoryIds
        ) {
          $join->on('catalog_item_categories.item_id', '=', 'catalog_items.id');
        })
        ->whereIn('catalog_item_categories.category_id', $catalogCategoryIds)
        ->groupBy('catalog_items.id');
    }

    if ($search !== null) {
      $searchFields = DB::table('catalog_item_template_fields')
        ->where('is_searchable', '=', true)
        ->get();

      foreach ($searchFields as $searchField) {
        $searchId = $searchField->key;

        $items
          ->leftJoin(
            "catalog_item_template_fields as field_search_{$searchId}",
            function ($join) use ($searchId) {
              $join
                ->on(
                  "field_search_{$searchId}.template_id",
                  '=',
                  'catalog_items.template_id'
                )
                ->where("field_search_{$searchId}.key", '=', $searchId);
            }
          )
          ->leftJoin(
            "catalog_item_template_field_values as field_search_{$searchId}_values",
            function ($join) use ($searchId) {
              $join->on(
                "field_search_{$searchId}_values.item_id",
                '=',
                'catalog_items.id'
              );
              $join->on(
                "field_search_{$searchId}.id",
                '=',
                "field_search_{$searchId}_values.field_id"
              );
            }
          )
          ->orWhereRaw(
            "lower(field_search_{$searchId}_values.value) like lower(?)",
            ["%{$search}%"]
          )
          ->groupBy('catalog_items.id');
      }
    }

    if (count($sortFields) > 0) {
      foreach ($sortFields as $field) {
        if (is_numeric($field['field_id'])) {
          $direction = 'ASC';

          if (strtolower($field['direction']) === 'desc') {
            $direction = 'DESC';
          }

          $items->addSelect(
            DB::raw(
              "(" .
                "SELECT catalog_item_template_field_values.value AS field_id_{$field['field_id']}_value " .
                "FROM catalog_item_template_fields " .
                "LEFT JOIN catalog_item_template_field_values " .
                "ON catalog_item_template_field_values.field_id = catalog_item_template_fields.id " .
                "WHERE catalog_item_template_field_values.item_id = catalog_items.id " .
                "AND catalog_item_template_field_values.language = \"{$language}\" " .
                "AND catalog_item_template_fields.id = {$field['field_id']}" .
                ") " .
                "AS field_id_{$field['field_id']}_value"
            )
          );

          $items->orderBy("field_id_{$field['field_id']}_value", $direction);
          // $items->groupBy("field_id_{$field['field_id']}_value");
        }
      }
    }

    if ($publishedOnly) {
      $items->where('catalog_items.published', '=', 1);
    }

    // dd(Str::replaceArray('?', $items->getBindings(), $items->toSql()));

    return $items;
  }

  protected function catalogItemsData(
    array $catalogItemIds,
    $isListing = false,
    $language = null
  ) {
    return DB::table('catalog_items')
      ->select([
        'catalog_items.id as catalog_item_id',
        'views.path as view_path',
        'catalog_item_templates.name as item_template_name',
        'catalog_item_templates.path as item_template_path',
        'catalog_item_template_fields.key as template_field_key',
        'catalog_item_template_fields.name as template_field_name',
        'catalog_item_template_fields.type as template_field_type',
        'catalog_item_template_fields.is_multilingual as template_field_is_multilingual',
        'catalog_item_template_fields.default_value as template_field_default_value',
        'catalog_item_template_field_values.value as template_field_value',
        'catalog_item_template_field_values.language as template_field_language',
      ])
      ->leftJoin(
        'catalog_item_templates',
        'catalog_items.template_id',
        '=',
        'catalog_item_templates.id'
      )
      ->leftJoin('views', 'views.id', '=', 'catalog_item_templates.view_id')
      ->leftJoin('catalog_item_template_fields', function ($join) use (
        $isListing
      ) {
        $join->on(
          'catalog_item_template_fields.template_id',
          '=',
          'catalog_item_templates.id'
        );

        if ($isListing) {
          $join->where('catalog_item_template_fields.use_in_listing', '=', '1');
        }
      })
      ->leftJoin('catalog_item_template_field_values', function ($join) use (
        $language
      ) {
        $join
          ->on(
            'catalog_item_template_field_values.item_id',
            '=',
            'catalog_items.id'
          )
          ->on(
            'catalog_item_template_field_values.field_id',
            '=',
            'catalog_item_template_fields.id'
          )
          ->where(function ($where) use ($language) {
            $where
              ->where(
                'catalog_item_template_field_values.language',
                '=',
                $language
              )
              ->orWhere(
                'catalog_item_template_field_values.language',
                '=',
                null
              );
          });
      })
      ->whereIn('catalog_items.id', $catalogItemIds)
      ->get();
  }

  protected function publicCatalogItemListing(
    $language = null,
    $parentCategoryId = null,
    $pageSize = 20,
    array $sortFields = [],
    $search = null,
    $ignorePublished = false
  ) {
    $catalogItemsIds = [];
    $catalogItems = $this->catalogItems(
      $sortFields,
      $language,
      $parentCategoryId,
      !$ignorePublished,
      $search
    )->paginate($pageSize);

    foreach ($catalogItems->items() as $item) {
      array_push($catalogItemsIds, $item->id);
    }

    $catalogItemsData = CatalogItems::catalogItemsData(
      $catalogItemsIds,
      true,
      $language
    );

    $newCatalogItemsData = [];

    foreach ($catalogItemsData as $data) {
      if (!isset($newCatalogItemsData[$data->catalog_item_id])) {
        $catalogItem = $newCatalogItemsData[
          $data->catalog_item_id
        ] = (object) [];

        $catalogItem->view_path = $data->view_path;
        $catalogItem->template_name = $data->item_template_name;
        $catalogItem->template_path = $data->item_template_path;
        $catalogItem->fields = (object) [];
      }

      if ($data->template_field_key !== null) {
        $fieldItem = $newCatalogItemsData[
          $data->catalog_item_id
        ]->fields->{$data->template_field_key} = (object) [];

        $fieldItem->key = $data->template_field_key;
        $fieldItem->name = $data->template_field_name;
        $fieldItem->value = $data->template_field_value;
        $fieldItem->default_value = $data->template_field_default_value;
        $fieldItem->type = $data->template_field_type;
        $fieldItem->is_multilungual = $data->template_field_is_multilingual;
        $fieldItem->language = $data->template_field_language;
      }
    }

    foreach ($catalogItems->items() as &$item) {
      $item->data = $newCatalogItemsData[$item->id];
    }

    return $catalogItems;
  }

  protected function publicCatalogItem(
    int $catalogItemId,
    $language = null,
    $isListing = false,
    $ignorePublished = false
  ) {
    $catalogItem = DB::table('catalog_items')->where('id', '=', $catalogItemId);

    if ($ignorePublished === false) {
      $catalogItem->where('published', '=', true);
    }

    $catalogItem = $catalogItem->get()->first();

    if (isset($catalogItem)) {
      $catalogItemData = CatalogItems::catalogItemsData(
        [$catalogItemId],
        $isListing,
        $language
      );

      $newCatalogItemData = (object) [];

      foreach ($catalogItemData as $data) {
        $newCatalogItemData->view_path = $data->view_path;
        $newCatalogItemData->template_name = $data->item_template_name;
        $newCatalogItemData->template_path = $isListing
          ? $data->item_template_path
          : $data->item_template_path . '_detail';

        if (!isset($newCatalogItemData->fields)) {
          $newCatalogItemData->fields = (object) [];
        }

        if ($data->template_field_key !== null) {
          $fieldItem = $newCatalogItemData->fields->{$data->template_field_key} = (object) [];

          $fieldItem->key = $data->template_field_key;
          $fieldItem->name = $data->template_field_name;
          $fieldItem->value = $data->template_field_value;
          $fieldItem->default_value = $data->template_field_default_value;
          $fieldItem->type = $data->template_field_type;
          $fieldItem->is_multilungual = $data->template_field_is_multilingual;
          $fieldItem->language = $data->template_field_language;
        }
      }

      $catalogItem->data = $newCatalogItemData;

      $categories = DB::table('catalog_categories')
        ->leftJoin(
          'catalog_item_categories',
          'catalog_item_categories.category_id',
          '=',
          'catalog_categories.id'
        )
        ->leftJoin(
          'catalog_category_values',
          'catalog_item_categories.category_id',
          '=',
          'catalog_category_values.category_id'
        )
        ->where('catalog_category_values.language', '=', $language)
        ->where('catalog_item_categories.item_id', '=', $catalogItemId)
        ->where('catalog_categories.published', '=', true)
        ->get();

      $catalogItem->categories = $categories;

      return $catalogItem;
    } else {
      return false;
    }
  }

  protected function catalogItem(int $catalogItemId) {
    return DB::table('catalog_items')
      ->where('id', '=', $catalogItemId)
      ->get()
      ->first();
  }

  protected function catalogItemDetail(
    int $catalogItemId,
    $published = null,
    $simplify = false
  ) {
    $catalogItem = DB::table('catalog_items')->where('id', '=', $catalogItemId);

    if ($published !== null) {
      $catalogItem->where('published', '=', $published);
    }

    $catalogItem = $catalogItem->get()->first();

    if (isset($catalogItem)) {
      $fields = CatalogItemTemplateFields::catalogItemTemplateFields(
        $catalogItem->template_id
      )
        ->orderBy('weight', 'ASC')
        ->get();

      $catalogItem->fields = $fields;

      // Add field values to results

      $templateFieldValues = DB::table('catalog_item_template_field_values')
        ->where('item_id', '=', $catalogItemId)
        ->get()
        ->toArray();

      // Add categories to results

      $categoryIds = [];

      $categories = DB::table('catalog_item_categories')
        ->select('category_id')
        ->where('item_id', '=', $catalogItemId)
        ->get();

      foreach ($categories as $category) {
        array_push($categoryIds, $category->category_id);
      }

      $catalogItem->categories = $categoryIds;

      foreach ($catalogItem->fields as &$field) {
        $transformedValues = [];
        $values = array_filter($templateFieldValues, function ($item) use (
          $field
        ) {
          return $item->field_id === $field->id;
        });

        foreach ($values as $value) {
          // Preformat output for GALLERY type
          if ($field->type === 'GALLERY') {
            $value->value = json_decode($value->value);
            $value->extra_content = json_decode($value->extra_content);
          }

          // Preformat output for IMAGE type
          if ($field->type === 'IMAGE') {
            $value->value = json_decode($value->value);
          }

          // Preformat output for LINK type
          if ($field->type === 'LINK') {
            $value->extra_content = json_decode($value->extra_content);
          }

          if ($value->language === null) {
            $transformedValues = $value;
          } else {
            $transformedValues[$value->language] = $value;
          }
        }

        $field->data = (object) $transformedValues;
      }

      if ($simplify === true) {
        $simplifiedFields = [];

        foreach ($catalogItem->fields as $field) {
          $simplifiedFields[$field->key] = (object) [
            'key' => $field->key,
            'name' => $field->name,
            'is_multilingual' => $field->is_multilingual,
            'type' => $field->type,
            'data' => $field->data,
          ];
        }

        $catalogItem->fields = (object) $simplifiedFields;
      }

      return $catalogItem;
    }
  }
}
