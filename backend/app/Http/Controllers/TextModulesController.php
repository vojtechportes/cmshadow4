<?php

namespace App\Http\Controllers;

use App\TextModules;
use Illuminate\Http\Request;
use Illuminate\Http\File;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;

class TextModulesController extends Controller {
  /**
   * Gets paginated list of text modules
   *
   * @return mixed Returns paginated list of text modules
   */
  public function getTextModules() {
    $textModules = TextModules::textModules()->paginate(
      TextModules::getPageSize()
    );

    return response()->json($textModules);
  }

  /**
   * Gets text module by moduleId
   *
   * @param int $moduleId
   * @return mixed Returns text module or 404 status code when text module is not found
   */
  public function getTextModule(int $moduleId) {
    $textModule = TextModules::textModule($moduleId);

    if (isset($textModule)) {
      return response()->json($textModule);
    } else {
      return response('', 404);
    }
  }

  /**
   * Creates new text module
   *
   * @param Illuminate\Http\Request $request
   * @return void
   */
  public function createTextModule(Request $request) {
    $this->validate($request, [
      'parent_id' => 'required|numeric',
      'content' => 'required',
    ]);

    DB::table('text_modules')->insert([
      'parent_id' => $request->input('parent_id'),
      'content' => $request->input('content', ''),
    ]);

    return response('', 204);
  }

  /**
   * Updates text module
   *
   * @param Illuminate\Http\Request $request
   * @param int $moduleId
   * @return void Returns 204 or 404 when text module is not found
   */
  public function updateTextModule(Request $request, int $moduleId) {
    $textModule = TextModules::textModule($moduleId);

    if (isset($textModule)) {
      DB::table('text_modules')
        ->where('parent_id', '=', $moduleId)
        ->update([
          'content' => $request->input('content', $textModule->content),
        ]);

      return response('', 204);
    } else {
      return response('', 404);
    }
  }

  /**
   * Deletes text module

   * @param int $moduleId
   * @return void Returns 204 status code or 404 when text module is not found
   */
  public function deleteTextModule(int $moduleId) {
    $textModule = TextModules::textModule($moduleId);

    if (isset($textModule)) {
      DB::table('text_modules')
        ->where('parent_id', '=', $moduleId)
        ->delete();

      return response('', 204);
    } else {
      return response('', 404);
    }
  }
}
