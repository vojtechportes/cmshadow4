<?php

namespace App\Http\View\Composers;

use Illuminate\View\View;
use Illuminate\Http\Request;
use App\CatalogSearchModules;

class CatalogSearchComposer {
  private function getCatalogSearchData(int $id, Request $request) {
    $data = CatalogSearchModules::catalogSearchModule($id);
    $searchValue = $request->input('search', '');

    if (isset($data)) {
      $data->search_value = $searchValue;

      return $data;
    } else {
      return [
        'search_placeholder' => '',
        'submit_label' => '',
        'search_value' => $searchValue,
      ];
    }
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
    $data = $this->getCatalogSearchData($moduleId, $request);

    $view->with('data', object_to_array($data));
  }
}
