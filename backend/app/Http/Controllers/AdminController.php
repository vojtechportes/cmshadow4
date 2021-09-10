<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AdminController extends Controller {
  /**
   */
  public function getAdmin(Request $request) {
    $content = file_get_contents(CMS_JS_PATH . '/index.html');

    return response($content);
  }
}
