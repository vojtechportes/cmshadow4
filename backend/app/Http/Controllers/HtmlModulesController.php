<?php

namespace App\Http\Controllers;

use App\HtmlModules;
use Illuminate\Http\Request;
use Illuminate\Http\File;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;

class HtmlModulesController extends Controller {
  /**
   * Gets paginated list of html modules
   *
   * @return mixed Returns paginated list of html modules
   */
  public function getHtmlModules() {
    $htmlModules = HtmlModules::htmlModules()->paginate(
      HtmlModules::getPageSize()
    );

    return response()->json($htmlModules);
  }

  /**
   * Gets html module by moduleId
   *
   * @param int $moduleId
   * @return mixed Returns html module or 404 status code when html module is not found
   */
  public function getHtmlModule(int $moduleId) {
    $htmlModule = HtmlModules::htmlModule($moduleId);

    if (isset($htmlModule)) {
      return response()->json($htmlModule);
    } else {
      return response('', 404);
    }
  }

  /**
   * Creates new html module
   *
   * @param Illuminate\Http\Request $request
   * @return void
   */
  public function createHtmlModule(Request $request) {
    $this->validate($request, [
      'parent_id' => 'required|numeric',
      'content' => 'required',
    ]);

    DB::table('html_modules')->insert([
      'parent_id' => $request->input('parent_id'),
      'content' => $request->input('content', ''),
    ]);

    return response('', 204);
  }

  /**
   * Updates html module
   *
   * @param Illuminate\Http\Request $request
   * @param int $moduleId
   * @return void Returns 204 or 404 when html module is not found
   */
  public function updateHtmlModule(Request $request, int $moduleId) {
    $htmlModule = HtmlModules::htmlModule($moduleId);

    if (isset($htmlModule)) {
      DB::table('html_modules')
        ->where('parent_id', '=', $moduleId)
        ->update([
          'content' => $request->input('content', $htmlModule->content),
        ]);

      return response('', 204);
    } else {
      return response('', 404);
    }
  }

  /**
   * Deletes html module

   * @param int $moduleId
   * @return void Returns 204 status code or 404 when html module is not found
   */
  public function deleteHtmlModule(int $moduleId) {
    $htmlModule = HtmlModules::htmlModule($moduleId);

    if (isset($htmlModule)) {
      DB::table('html_modules')
        ->where('parent_id', '=', $moduleId)
        ->delete();

      return response('', 204);
    } else {
      return response('', 404);
    }
  }
}
