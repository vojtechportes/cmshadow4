<?php

namespace App\Http\View\Composers;

use Illuminate\View\View;
use Illuminate\Http\Request;
use App\CatalogItems;
use App\CatalogListingModules;
use App\CatalogCurrencies;
use App\Http\View\Composers\BaseComposer;

class CatalogListingComposer extends BaseComposer {
  private function getCatalogListing(int $id) {
    $catalogListing = CatalogListingModules::catalogListingModule($id);

    if (isset($catalogListing)) {
      return $catalogListing;
    }
  }

  private function getCatalogData($request, int $id, array $params) {
    $data = $this->getCatalogListing($id);
    $language = null;
    $parentCategoryId = null;
    $parentCategoryVariableName = null;
    $currency = null;

    if (isset($data)) {
      $language = $data->language_code;
      $parentCategoryId = $data->category_id;
      $parentCategoryVariableName = $data->category_id_variable_name;
    }

    if ($language !== null) {
      $currency = CatalogCurrencies::catalogCurrencyByLanguageCode($language);
    }

    if (
      $parentCategoryVariableName &&
      array_key_exists($parentCategoryVariableName, $params)
    ) {
      if (is_numeric($params[$parentCategoryVariableName])) {
        $parentCategoryId = (int) $params[$parentCategoryVariableName];
      }
    }

    $pageSize = $request->input('page_size', 20);
    $sortFields = CatalogItems::getSortFields($request);
    $search = $request->input('search', null);

    if (!is_numeric($pageSize)) {
      $pageSize = 20;
    }

    $data = CatalogItems::publicCatalogItemListing(
      $language,
      $parentCategoryId,
      $pageSize,
      $sortFields,
      $search,
      $this->isAuthorized($request)
    );

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
    $data = $this->getCatalogData($request, $moduleId, $params);

    $data = array_merge(object_to_array($data['data']), [
      'currency' => object_to_array($data['currency']),
    ]);

    $view->with('data', $data);
  }
}
