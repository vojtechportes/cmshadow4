<?php

namespace App\Http\View\Composers;

use Illuminate\View\View;
use Illuminate\Http\Request;
use App\CatalogCategories;
use App\CatalogCategoryModules;
use App\Http\View\Composers\BaseComposer;

class CatalogCategoryComposer extends BaseComposer {
  private function getCatalogCategory(int $id) {
    $catalogCategory = CatalogCategoryModules::catalogCategoryModule($id);

    if (isset($catalogCategory)) {
      return $catalogCategory;
    }
  }

  private function getCatalogData(
    $request,
    int $id,
    array $params,
    array $paramBindings
  ) {
    $data = $this->getCatalogCategory($id);
    $categoryId = null;
    $language = null;
    $catalogCategoryIdVariableName = null;
    $loadFromGlobalContext = null;

    if (isset($data)) {
      $categoryId = $data->category_id;
      $language = $data->language_code;
      $catalogCategoryIdVariableName = $data->catalog_category_id_variable_name;
      $loadFromGlobalContext = $data->load_from_global_context;
    }

    if (
      $catalogCategoryIdVariableName &&
      array_key_exists($catalogCategoryIdVariableName, $params)
    ) {
      if (is_numeric($params[$catalogCategoryIdVariableName])) {
        $categoryId = (int) $params[$catalogCategoryIdVariableName];
      } else {
        return ['data' => null];
      }
    }

    if (
      $loadFromGlobalContext !== false &&
      array_key_exists($catalogItemIdVariableName, $paramBindings)
    ) {
      $data = $paramBindings[$catalogItemIdVariableName];
    } else {
      $data = DB::table('catalog_category_values')
        ->where('category_id', '=', $categoryId)
        ->where('language', '=', $language)
        ->get()
        ->first();
    }

    return ['data' => $data];
  }

  /**
   * Bind data to the view.
   *
   * @param View $view
   * @return void
   */
  public function compose(View $view) {
    $moduleId = $view->getData()['component']['id'];
    $request = $view->getData()['global']['request'];
    $params = $view->getData()['global']['params'];
    $paramBindings = $view->getData()['global']['param_bindings'];
    $data = $this->getCatalogData($request, $moduleId, $params, $paramBindings);

    if (!$data['data']) {
      $data = false;
    } else {
      $data = $data['data'];
    }

    $view->with('data', object_to_array($data));
  }
}
