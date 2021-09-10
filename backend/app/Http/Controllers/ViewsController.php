<?php

namespace App\Http\Controllers;

use App\Views;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;

class ViewsController extends Controller {
  /**
   * Gets paginated list of views
   *
   * @return mixed Returns paginated list of views
   */
  public function getViews() {
    $views = Views::views()->paginate(Views::getPageSize());

    return response()->json($views);
  }

  /**
   * Gets list of all views
   *
   * @return mixed Returns list of all views
   */
  public function getAllViews() {
    $views = Views::views()->get();

    return response()->json($views);
  }

  /**
   * Gets view by viewId
   *
   * @param int $viewId
   * @return mixed Returns view or 404 status code when view is not found
   */
  public function getView(int $viewId) {
    $view = Views::view($viewId);

    if (isset($view)) {
      return response()->json($view);
    } else {
      return response('', 404);
    }
  }

  /**
   * Creates new view
   *
   * @param Illuminate\Http\Request $request
   * @return mixed Returns id of created view
   */
  public function createView(Request $request) {
    $this->validate($request, [
      'name' => 'required|max:255|unique:views',
      'path' => 'required|max:255|alpha_dash|unique:views',
    ]);

    $id = DB::table('views')->insertGetId([
      'name' => $request->input('name'),
      'path' => $request->input('path'),
    ]);

    return response()->json(['id' => $id]);
  }

  /**
   * Updates view
   *
   * @param Illuminate\Http\Request $request
   * @param int $viewId
   * @return void Returns 204 or 404 when view is not found
   */
  public function updateView(Request $request, int $viewId) {
    $view = Views::view($viewId);

    if (isset($view)) {
      $this->validate($request, [
        'name' => "max:255|unique:views,name,{$view->id}",
        'path' => "max:255|alpha_dash|unique:views,path,{$view->id}",
      ]);

      DB::table('views')
        ->where('id', '=', $viewId)
        ->update([
          'name' => $request->input('name', $view->name),
          'path' => $request->input('path', $view->path),
        ]);

      return response('', 204);
    } else {
      return response('', 404);
    }
  }

  /**
   * Deletes view

   * @param int $viewId
   * @return void Returns 204 status code or 404 when view is not found
   */
  public function deleteView(int $viewId) {
    $view = Views::view($viewId);

    if (isset($view)) {
      DB::table('views')
        ->where('id', '=', $viewId)
        ->delete();

      return response('', 204);
    } else {
      return response('', 404);
    }
  }
}
