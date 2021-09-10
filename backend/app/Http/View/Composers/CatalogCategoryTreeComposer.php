<?php

namespace App\Http\View\Composers;

use Illuminate\View\View;
use App\CatalogCategoryTreeModules;
use App\CatalogCategories;

class CatalogCategoryTreeComposer {
  private function getCatalogCategoryTreeData(int $id) {
    $data = CatalogCategoryTreeModules::catalogCategoryTreeModule($id);
    $catalogCategoryTree = CatalogCategories::catalogCategoryTree(
      $data->parent_category_id,
      true,
      true,
      $data->language_code
    );

    return [
      'module_data' => object_to_array($data),
      'items' => $catalogCategoryTree,
    ];
  }

  /**
   * Bind data to the view.
   *
   * @param View $view
   * @return void
   */
  public function compose(View $view) {
    $moduleId = $view->getData()['component']['id'];
    $data = $this->getCatalogCategoryTreeData($moduleId);

    $view->with('data', $data);
  }
}
