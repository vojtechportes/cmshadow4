<?php

namespace App;

use App\BaseModel;
use App\Navigations;
use App\NavigationItems;
use Illuminate\Support\Facades\DB;

class Navigations extends BaseModel {
  private function buildTree(
    array &$elements,
    $parentId = 0,
    $keys = ['parent' => 'parent_id', 'id' => 'id']
  ) {
    $branch = [];

    foreach ($elements as &$element) {
      if ($element[$keys['parent']] == $parentId) {
        $children = $this->buildTree($elements, $element['id'], $keys);

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

  protected function navigations() {
    return DB::table('navigations')->orderBy('id', 'desc');
  }

  protected function navigation(int $navigationId) {
    return DB::table('navigations')
      ->where('id', '=', $navigationId)
      ->get()
      ->first();
  }

  protected function publicNavigation(int $navigationId) {
    $items = [];
    $pageIdentifiers = [];
    $pages = [];
    $navigation = $this->navigation($navigationId);

    if (isset($navigation)) {
      $navigationItems = NavigationItems::navigationItems($navigationId)->get();

      foreach ($navigationItems as $navigationItem) {
        if ($navigationItem->page_identifier !== null) {
          array_push($pageIdentifiers, $navigationItem->page_identifier);
        }
      }

      $pageItems = DB::table('pages')
        ->select('pages.identifier', 'pages.path', 'pages.status', 'pages.name')
        ->addSelect(
          DB::raw(
            "(" .
              "SELECT IF(" .
              "COUNT(published_page.identifier) > 0, 1, 0" .
              ") AS is_published " .
              "FROM pages as published_page " .
              "WHERE published_page.identifier = pages.identifier AND status = 'PUBLISHED'" .
              ") AS is_published"
          )
        )
        ->addSelect(
          DB::raw(
            "(" .
              "SELECT published_page.path AS published_path " .
              "FROM pages as published_page " .
              "WHERE published_page.identifier = pages.identifier AND status = 'PUBLISHED'" .
              ") AS published_path"
          )
        )
        ->whereIn('identifier', $pageIdentifiers)
        ->where(
          'version',
          '=',
          DB::raw(
            "(SELECT MAX(version) from pages as latest_version_pages WHERE latest_version_pages.identifier = pages.identifier)"
          )
        )
        ->get();

      foreach ($pageItems as $page) {
        $pages[$page->identifier] = $page;
      }

      foreach ($navigationItems as $navigationItem) {
        if ($navigationItem->page_identifier !== null) {
          $navigationItem->page = $pages[$navigationItem->page_identifier];
        }

        array_push($items, get_object_vars($navigationItem));
      }

      $rootItems = array_filter($items, function ($item) {
        return $item['parent_id'] === null;
      });

      foreach ($rootItems as &$item) {
        $tree = $this->buildTree($items, $item['id']);

        if (count($tree) > 0) {
          $item['children'] = $tree;
        }
      }

      if (count($rootItems) > 0) {
        $navigation->items = array_values($rootItems);
      }

      return $navigation;
    }
  }
}
