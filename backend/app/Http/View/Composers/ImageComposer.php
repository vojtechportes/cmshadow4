<?php

namespace App\Http\View\Composers;

use Illuminate\View\View;
use App\ImageModules;

class ImageComposer {
  private function getImageData(int $id) {
    $image = ImageModules::imageModule($id);

    if (isset($image)) {
      $image->image_path = asset(CMS_IMAGE_PATH . $image->file_name);

      return $image;
    } else {
      return [];
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
    $data = $this->getImageData($moduleId);

    dd($data);

    $view->with('data', object_to_array($data));
  }
}
