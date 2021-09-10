<?php

namespace App\Http\Controllers;

use App\Navigations;
use App\NavigationItems;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class NavigationsController extends Controller {
  /**
   * Gets paginated list of navigations
   *
   * @return mixed Return paginated list of navigations
   */
  public function getNavigations() {
    $navigations = Navigations::navigations()->paginate(
      Navigations::getPageSize()
    );

    return response()->json($navigations);
  }

  /**
   * Gets list of all navigations
   *
   * @return mixed Return list of all navigations
   */
  public function getAllNavigations() {
    $navigations = Navigations::navigations()->get();

    return response()->json($navigations);
  }

  /**
   * Gets navigation by navigationId
   *
   * @param string $navigationId
   * @return mixed Returns navigation or 404 status code when
   *               navigation is not found
   */
  public function getNavigation(int $navigationId) {
    $navigation = Navigations::publicNavigation($navigationId);

    if (isset($navigation)) {
      return response()->json($navigation);
    } else {
      return response('', 404);
    }
  }

  /**
   * Creates new navigation
   *
   * @param Illuminate\Http\Request $request
   * @return mixed Returns id of created navigation
   */
  public function createNavigation(Request $request) {
    $this->validate($request, [
      'name' => 'required|max:255|unique:navigations',
      'path' => 'required|max:255|alpha_dash',
    ]);

    $id = DB::table('navigations')->insertGetId([
      'name' => $request->input('name'),
      'path' => $request->input('path'),
    ]);

    return response()->json(['id' => $id]);
  }

  /**
   * Updates navigation
   *
   * @param Illuminate\Http\Request $request
   * @param int $navigationId
   * @return void Returns 204 or 404 when navigation is not found
   */
  public function updateNavigation(Request $request, int $navigationId) {
    $navigation = Navigations::navigation($navigationId);

    if (isset($navigation)) {
      $this->validate($request, [
        'name' => "max:255|unique:navigations,name,{$navigation->id}",
        'path' => 'max:255|alpha_dash',
      ]);

      DB::table('navigations')
        ->where('id', '=', $navigationId)
        ->update([
          'name' => $request->input('name', $navigation->name),
          'path' => $request->input('path', $navigation->path),
        ]);

      return response('', 204);
    } else {
      return response('', 404);
    }
  }

  /**
   * Deletes navigation

   * @param int $navigationId
   * @return void Returns 204 status code or 404 when navigation 
   *              is not found
   */
  public function deleteNavigation(int $navigationId) {
    $navigation = Navigations::navigation($navigationId);

    if (isset($navigation)) {
      DB::transaction(function () use ($navigationId) {
        DB::table('navigations')
          ->where('id', '=', $navigationId)
          ->delete();

        DB::table('navigation_items')
          ->where('navigation_id', '=', $navigationId)
          ->delete();

        DB::table('navigation_item_variable_mappings')
          ->where('navigation_id', '=', $navigationId)
          ->delete();
      });

      return response('', 204);
    } else {
      return response('', 404);
    }
  }
}
