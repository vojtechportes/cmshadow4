<?php

namespace App\Http\View\Composers;

use Illuminate\View\View;
use Illuminate\Http\Request;
use App\CatalogItems;
use App\CatalogDetailModules;
use App\CatalogCurrencies;
use App\CatalogCategories;
use App\Http\View\Composers\BaseComposer;

class CatalogDetailComposer extends BaseComposer {
  private function getCatalogDetail(int $id) {
    $catalogDetail = CatalogDetailModules::catalogDetailModule($id);

    if (isset($catalogDetail)) {
      return $catalogDetail;
    }
  }

  private function getCatalogData(
    $request,
    int $id,
    array $params,
    array $paramBindings
  ) {
    $data = $this->getCatalogDetail($id);
    $language = null;
    $catalogItemIdVariableName = null;
    $loadFromGlobalContext = null;
    $currency = null;

    if (isset($data)) {
      $language = $data->language_code;
      $catalogItemIdVariableName = $data->catalog_item_id_variable_name;
      $loadFromGlobalContext = $data->load_from_global_context;
    }

    if ($language !== null) {
      $currency = CatalogCurrencies::catalogCurrencyByLanguageCode($language);
    }

    if (
      $catalogItemIdVariableName &&
      array_key_exists($catalogItemIdVariableName, $params)
    ) {
      if (is_numeric($params[$catalogItemIdVariableName])) {
        $catalogItemId = (int) $params[$catalogItemIdVariableName];
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
      $data = CatalogItems::publicCatalogItem(
        $catalogItemId,
        $language,
        false,
        $this->isAuthorized($request)
      );
    }

    return ['data' => $data, 'currency' => $currency];
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
      $data = array_merge(object_to_array($data['data']), [
        'currency' => object_to_array($data['currency']),
      ]);
    }
    $view->with('data', $data);
  }
}
