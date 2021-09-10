<?php

namespace App\Http\Controllers;

use App\TemplatePreview;
use Illuminate\Http\Request;

class TemplatePreviewController extends Controller {
  /**
   * Gets template preview
   *
   * @return mixed template preview
   */
  public function getTemplatePreview(Request $request) {
    $this->validate($request, [
      'view_name' => 'required|string',
      'template_name' => 'required|string',
    ]);

    $viewName = $request->input('view_name');
    $templateName = $request->input('template_name');

    $tempaltePreview = TemplatePreview::getTemplateData(
      $viewName,
      $templateName
    );

    if ($tempaltePreview) {
      return response()->json($tempaltePreview);
    } else {
      return response('', 404);
    }
  }
}
