<?php

namespace App\Http\Controllers;

use App\HeadingModules;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;

class HeadingModulesController extends Controller {
  /**
   * Gets paginated list of heading modules
   *
   * @return mixed Returns paginated list of heading modules
   */
  public function getHeadingModules() {
    $headingModules = HeadingModules::headingModules()->paginate(
      HeadingModules::getPageSize()
    );

    return response()->json($headingModules);
  }

  /**
   * Gets heading module by moduleId
   *
   * @param int $moduleId
   * @return mixed Returns heading module or 404 status code when heading module is not found
   */
  public function getHeadingModule(int $moduleId) {
    $headingModule = HeadingModules::headingModule($moduleId);

    if (isset($headingModule)) {
      return response()->json($headingModule);
    } else {
      return response('', 404);
    }
  }

  /**
   * Creates new heading module
   *
   * @param Illuminate\Http\Request $request
   * @return void
   */
  public function createHeadingModule(Request $request) {
    $this->validate($request, [
      'parent_id' => 'required|numeric',
      'level' => ['required', Rule::in(['1', '2', '3', '4', '5', '6'])],
      'content' => 'required|string',
    ]);

    DB::table('heading_modules')->insert([
      'parent_id' => $request->input('parent_id'),
      'level' => $request->input('level'),
      'path' => $request->input('content'),
    ]);

    return response('', 204);
  }

  /**
   * Updates heading module
   *
   * @param Illuminate\Http\Request $request
   * @param int $moduleId
   * @return void Returns 204 or 404 when heading module is not found
   */
  public function updateHeadingModule(Request $request, int $moduleId) {
    $headingModule = HeadingModules::headingModule($moduleId);

    $this->validate($request, [
      'level' => [Rule::in(['1', '2', '3', '4', '5', '6'])],
      'content' => 'string',
    ]);

    if (isset($headingModule)) {
      DB::table('heading_modules')
        ->where('parent_id', '=', $moduleId)
        ->update([
          'level' => $request->input('level', $headingModule->level),
          'content' => $request->input('content', $headingModule->content),
        ]);

      return response('', 204);
    } else {
      return response('', 404);
    }
  }

  /**
   * Deletes heading module

   * @param int $moduleId
   * @return void Returns 204 status code or 404 when heading module is not found
   */
  public function deleteHeadingModule(int $moduleId) {
    $headingModule = HeadingModules::headingModule($moduleId);

    if (isset($headingModule)) {
      DB::table('heading_modules')
        ->where('parent_id', '=', $moduleId)
        ->delete();

      return response('', 204);
    } else {
      return response('', 404);
    }
  }
}
