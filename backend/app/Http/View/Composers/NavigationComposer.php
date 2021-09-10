<?php

namespace App\Http\View\Composers;

use Illuminate\View\View;
use App\Navigations;
use App\NavigationModules;

class NavigationComposer {
  private function getNavigation(int $id) {
    $navigation = NavigationModules::navigationModule($id);
    $navigation = Navigations::publicNavigation($navigation->navigation_id);

    return $navigation;
  }
  /**
   * Bind data to the view.
   *
   * @param View $view
   * @return void
   */
  public function compose(View $view) {
    $moduleId = $view->getData()['component']['id'];
    $data = $this->getNavigation($moduleId);

    $view->with('data', object_to_array($data));
  }
}
