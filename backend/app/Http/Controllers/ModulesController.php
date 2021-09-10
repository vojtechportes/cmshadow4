<?php

namespace App\Http\Controllers;

use App\Modules;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ModulesController extends Controller {
  /**
   * Gets all modules by pageId
   *
   * @param Illuminate\Http\Request $request
   * @param int $pageId
   * @return mixed Return all modules
   */
  public function getModules(Request $request) {
    $this->validate($request, [
      'page_identifier' => 'required|exists:pages,identifier',
      'page_version' => 'required|numeric',
      'layout_id' => 'required|numeric|exists:layouts,id',
      'template_page_ids.*' => 'numeric|exists:template_pages,id',
    ]);

    $modules = Modules::modules(
      $request->input('page_identifier'),
      $request->input('page_version'),
      $request->input('layout_id'),
      $request->input('template_page_ids', [])
    )->get();

    return response()->json($modules);
  }

  /**
   * Gets module by moduleId
   *
   * @param string $moduleId
   * @return mixed Returns module or 404 status code when module is not found
   */
  public function getModule(int $moduleId) {
    $module = Modules::module($moduleId);

    if (isset($module)) {
      return response()->json($module);
    } else {
      return response('', 404);
    }
  }

  /**
   * Creates new module
   *
   * @param Illuminate\Http\Request $request
   * @return mixed Returns id of created module
   */
  public function createModule(Request $request) {
    $pageType = $request->input('page_type');

    $uuid = Modules::getUUID();

    $commonValidation = [
      'layout_id' => 'required|numeric|exists:layouts,id',
      'slot_id' => 'required|numeric|exists:layout_slots,id',
      'page_type' => 'required',
      'module_type' => 'required',
      'weight' => 'numeric',
    ];

    $commonProps = [
      'identifier' => $uuid,
      'layout_id' => $request->input('layout_id'),
      'slot_id' => $request->input('slot_id'),
      'page_type' => $pageType,
      'module_type' => $request->input('module_type'),
      'weight' => $request->input('weight', 50),
    ];

    if ($pageType === 'PAGE') {
      $validation = array_merge($commonValidation, [
        'page_identifier' => 'required|exists:pages,identifier',
        'page_version' => 'required|numeric',
      ]);

      $props = array_merge($commonProps, [
        'page_identifier' => $request->input('page_identifier'),
        'page_version' => $request->input('page_version'),
        'template_page_id' => null,
      ]);

      $this->validate($request, $validation);

      $id = DB::table('modules')->insertGetId($props);

      return response()->json(['id' => $id]);
    } elseif ($pageType === 'TEMPLATE_PAGE') {
      $validation = array_merge($commonValidation, [
        'template_page_id' => 'required|numeric',
      ]);

      $props = array_merge($commonProps, [
        'template_page_id' => $request->input('template_page_id'),
        'page_identifier' => null,
        'page_version' => null,
      ]);

      $this->validate($request, $validation);

      $id = DB::table('modules')->insertGetId($props);

      return response()->json(['id' => $id]);
    }
  }

  /**
   * Updates module
   *
   * Only module of page_type TEMPLATE_PAGE can be updated
   *
   * @param Illuminate\Http\Request $request
   * @param int $moduleId
   * @return void Returns 204 status code or 404 satus code when
   *              module is not found
   */
  public function updateModule(Request $request, int $moduleId) {
    $this->validate($request, [
      'slot_id' => 'numeric|exists:layout_slots,id',
      'weight' => 'numeric',
    ]);

    $module = Modules::module($moduleId);

    if (isset($module)) {
      if ($module->page_type !== 'TEMPLATE_PAGE') {
        return response('', 422);
      }

      DB::table('modules')
        ->where('id', '=', $moduleId)
        ->update([
          'slot_id' => $request->input('slot_id', $module->slot_id),
          'weight' => $request->input('weight', $module->weight),
        ]);

      return response('', 204);
    } else {
      return response('', 404);
    }
  }

  /**
   * Clones module under new version
   *
   * Only module of page_type PAGE can be cloned
   *
   * @param Illuminate\Http\Request $request
   * @param int $moduleId
   * @return mixed Returns id of created module
   */
  public function cloneModule(Request $request, int $moduleId) {
    $this->validate($request, [
      'page_version' => 'required|numeric',
      'slot_id' => 'numeric|exists:layout_slots,id',
      'weight' => 'numeric',
    ]);

    $module = Modules::module($moduleId);

    if (isset($module)) {
      if ($module->page_type !== 'PAGE') {
        return response('', 422);
      }

      $id = DB::table('modules')->insertGetId([
        'identifier' => $module->identifier,
        'template_page_id' => $module->template_page_id,
        'page_identifier' => $module->page_identifier,
        'page_version' => $request->input(
          'page_version',
          $module->page_version
        ),
        'layout_id' => $module->layout_id,
        'slot_id' => $request->input('slot_id', $module->slot_id),
        'page_type' => $module->page_type,
        'module_type' => $module->module_type,
        'weight' => $request->input('weight', $module->weight),
      ]);

      return response()->json(['id' => $id]);
    } else {
      return response('', 404);
    }
  }

  /**
   * Deletes module
   *
   * @param int $moduleId
   * @return void Returns 204 status code or 404 satus code when
   *              module is not found
   */
  public function deleteModule(int $moduleId) {
    $module = Modules::module($moduleId);

    if (isset($module)) {
      DB::transaction(function () use ($module, $moduleId) {
        $moduleData = DB::table(strtolower($module->module_type) . "_modules")
          ->where('parent_id', '=', $module->id)
          ->get()
          ->first();

        DB::table('modules')
          ->where('id', '=', $moduleId)
          ->delete();

        if (isset($moduleData)) {
          DB::table(strtolower($module->module_type) . "_modules")
            ->where('parent_id', '=', $moduleId)
            ->delete();
        }
      });

      return response('', 204);
    } else {
      return response('', 404);
    }
  }
}
