<?php

namespace App;

use App\BaseModel;
use Illuminate\Support\Facades\DB;

class CatalogCategories extends BaseModel {
  private function buildTree(
    array &$elements,
    $parentId = 0,
    $keys = ['parent' => 'parent_id', 'id' => 'id']
  ) {
    $branch = [];

    foreach ($elements as &$element) {
      if ($element[$keys['parent']] === $parentId) {
        $children = $this->buildTree($elements, $element[$keys['id']], $keys);

        if ($children) {
          $element['children'] = $children;
        }

        array_push($branch, $element);

        unset($element);
      }
    }

    usort($branch, function ($a, $b) {
      return $a['weight'] <=> $b['weight'];
    });

    return $branch;
  }

  protected function catalogCategories() {
    return DB::table('catalog_categories');
  }

  protected function catalogCategoryTree(
    $parentId = null,
    $publishedOnly = false,
    $withDetail = false,
    $languageCode
  ) {
    $items = [];
    $catalogCategories = $this->catalogCategories()

      /**
       * Count number of assigned items to each category
       */
      ->leftJoin(
        'catalog_item_categories',
        'catalog_item_categories.category_id',
        '=',
        'catalog_categories.id'
      )
      ->addSelect(
        DB::raw(
          'catalog_categories.*, COUNT(catalog_item_categories.item_id) as items_count'
        )
      );

    if ($parentId !== null) {
      $catalogCategoryIds = CatalogCategories::getChildrenRecursive(
        $parentId,
        'catalog_categories',
        'catalog_categories.parent_id'
      );

      $catalogCategories->whereIn('catalog_categories.id', $catalogCategoryIds);
    }

    if ($publishedOnly !== false) {
      $catalogCategories->where('published', '=', 1);
    }

    $catalogCategories->groupBy('catalog_categories.id');

    $catalogCategories = $catalogCategories->get();

    $categoryIds = [];

    foreach ($catalogCategories as $category) {
      if ($withDetail !== false) {
        array_push($categoryIds, $category->id);
      }

      array_push($items, get_object_vars($category));
    }

    if ($withDetail !== false) {
      $catalogCategoryValues = DB::table('catalog_category_values')
        ->whereIn('category_id', $categoryIds)
        ->get();

      foreach ($items as &$item) {
        $filteredData = array_filter(
          object_to_array($catalogCategoryValues),
          function ($value) use ($item) {
            return $item['id'] === $value['category_id'];
          }
        );

        if (isset($languageCode)) {
          $filteredDataByLanguage = array_filter($filteredData, function (
            $value
          ) use ($languageCode) {
            return $value['language'] === $languageCode;
          });

          $item['data'] = reset($filteredDataByLanguage);
        } else {
          $item['data'] = $filteredData;
        }
      }
    }

    if ($parentId === null) {
      $rootItems = array_filter($items, function ($item) {
        return $item['parent_id'] === null;
      });
    } else {
      $rootItems = array_filter($items, function ($item) use ($parentId) {
        return $item['id'] === (int) $parentId;
      });
    }

    foreach ($rootItems as &$item) {
      $tree = $this->buildTree($items, $item['id']);

      if (count($tree) > 0) {
        $item['children'] = $tree;
      }
    }

    $data = array_values($rootItems);

    return $data;
  }

  protected function catalogCategory(
    int $catalogCategoryId,
    $publishedOnly = false
  ) {
    $catalogCategory = DB::table('catalog_categories')->where(
      'id',
      '=',
      $catalogCategoryId
    );

    if ($publishedOnly === true) {
      $catalogCategory->where('published', '=', 1);
    }

    $catalogCategory = $catalogCategory->get()->first();

    return $catalogCategory;
  }
}
