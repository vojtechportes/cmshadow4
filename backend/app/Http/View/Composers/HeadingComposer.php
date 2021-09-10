<?php

namespace App\Http\View\Composers;

use Illuminate\View\View;
use App\HeadingModules;

class HeadingComposer {
  private function getHeadingContent(int $id) {
    $heading = HeadingModules::headingModule($id);

    return $heading;
  }
  /**
   * Bind data to the view.
   *
   * @param View $view
   * @return void
   */
  public function compose(View $view) {
    $moduleId = $view->getData()['component']['id'];
    $data = $this->getHeadingContent($moduleId);

    $view->with('data', object_to_array($data));
  }
}
