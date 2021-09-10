<?php

namespace App\Http\Controllers;

use App\ButtonModules;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;

class ButtonModulesController extends Controller {
  /**
   * Gets paginated list of button modules
   *
   * @return mixed Returns paginated list of button modules
   */
  public function getButtonModules() {
    $buttonModules = ButtonModules::buttonModules()->paginate(
      ButtonModules::getPageSize()
    );

    return response()->json($buttonModules);
  }

  /**
   * Gets button module by moduleId
   *
   * @param int $moduleId
   * @return mixed Returns button module or 404 status code when button module is not found
   */
  public function getButtonModule(int $moduleId) {
    $buttonModule = ButtonModules::buttonModule($moduleId);

    if (isset($buttonModule)) {
      return response()->json($buttonModule);
    } else {
      return response('', 404);
    }
  }

  /**
   * Creates new button module
   *
   * @param Illuminate\Http\Request $request
   * @return void
   */
  public function createButtonModule(Request $request) {
    $this->validate($request, [
      'parent_id' => 'required|numeric',
      'text' => 'required|string',
      'path' => 'required|string',
      'target' => ['required', Rule::in(['BLANK', 'SELF', 'PARENT', 'TOP'])],
      'button_id' => 'numeric|exists:buttons,id',
    ]);

    DB::table('button_modules')->insert([
      'parent_id' => $request->input('parent_id'),
      'text' => $request->input('text'),
      'path' => $request->input('path'),
      'target' => $request->input('target'),
      'button_id' => $request->input('button_id'),
    ]);

    return response('', 204);
  }

  /**
   * Updates button module
   *
   * @param Illuminate\Http\Request $request
   * @param int $moduleId
   * @return void Returns 204 or 404 when button module is not found
   */
  public function updateButtonModule(Request $request, int $moduleId) {
    $buttonModule = ButtonModules::buttonModule($moduleId);

    $this->validate($request, [
      'text' => 'string',
      'path' => 'string',
      'target' => [Rule::in(['BLANK', 'SELF', 'PARENT', 'TOP'])],
      'button_id' => 'exists:buttons,id',
    ]);

    if (isset($buttonModule)) {
      DB::table('button_modules')
        ->where('parent_id', '=', $moduleId)
        ->update([
          'text' => $request->input('text', $buttonModule->content),
          'path' => $request->input('path', $buttonModule->path),
          'target' => $request->input('target', $buttonModule->content),
          'button_id' => $request->input('button_id', $buttonModule->content),
        ]);

      return response('', 204);
    } else {
      return response('', 404);
    }
  }

  /**
   * Deletes button module

   * @param int $moduleId
   * @return void Returns 204 status code or 404 when button module is not found
   */
  public function deleteButtonModule(int $moduleId) {
    $buttonModule = ButtonModules::buttonModule($moduleId);

    if (isset($buttonModule)) {
      DB::table('button_modules')
        ->where('parent_id', '=', $moduleId)
        ->delete();

      return response('', 204);
    } else {
      return response('', 404);
    }
  }
}
