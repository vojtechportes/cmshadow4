<?php

namespace App\Http\Controllers;

use App\NavigationModules;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class NavigationModulesController extends Controller {
  /**
   * Gets paginated list of navigation modules
   *
   * @return mixed Returns paginated list of navigation modules
   */
  public function getNavigationModules() {
    $navigationModules = NavigationModules::navigationModules()->paginate(
      NavigationModules::getPageSize()
    );

    return response()->json($navigationModules);
  }

  /**
   * Gets navigation module by moduleId
   *
   * @param int $moduleId
   * @return mixed Returns navigation module or 404 status code when navigation module is not found
   */
  public function getNavigationModule(int $moduleId) {
    $navigationModule = NavigationModules::navigationModule($moduleId);

    if (isset($navigationModule)) {
      return response()->json($navigationModule);
    } else {
      return response('', 404);
    }
  }

  /**
   * Creates new navigation module
   *
   * @param Illuminate\Http\Request $request
   * @return void
   */
  public function createNavigationModule(Request $request) {
    $this->validate($request, [
      'parent_id' => 'required|numeric',
      'navigation_id' => 'required|numeric',
    ]);

    DB::table('navigation_modules')->insert([
      'parent_id' => $request->input('parent_id'),
      'navigation_id' => $request->input('navigation_id'),
    ]);

    return response('', 204);
  }

  /**
   * Updates navigation module
   *
   * @param Illuminate\Http\Request $request
   * @param int $moduleId
   * @return void Returns 204 or 404 when navigation module is not found
   */
  public function updateNavigationModule(Request $request, int $moduleId) {
    $navigationModule = NavigationModules::navigationModule($moduleId);

    if (isset($navigationModule)) {
      DB::table('navigation_modules')
        ->where('parent_id', '=', $moduleId)
        ->update([
          'parent_id' => $request->input(
            'parent_id',
            $navigationModule->parent_id
          ),
        ]);

      return response('', 204);
    } else {
      return response('', 404);
    }
  }

  /**
   * Deletes navigation module

   * @param int $moduleId
   * @return void Returns 204 status code or 404 when navigation module is not found
   */
  public function deleteNavigationModule(int $moduleId) {
    $navigationModule = NavigationModules::navigationModule($moduleId);

    if (isset($navigationModule)) {
      DB::table('navigation_modules')
        ->where('parent_id', '=', $moduleId)
        ->delete();

      return response('', 204);
    } else {
      return response('', 404);
    }
  }
}
