<?php

namespace App\Http\View\Composers;

use Illuminate\View\View;
use App\TextModules;

class TextComposer {
  private function getTextContent(int $id) {
    $text = TextModules::textModule($id);

    if (isset($text)) {
      return $text->content;
    } else {
      return '';
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
    $content = $this->getTextContent($moduleId);

    $view->with('content', $content);
  }
}
