<?php

namespace App\Http\Controllers;

use App\Layouts;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class LayoutsController extends Controller {
  /**
   * Gets paginated list of layouts
   *
   * @return mixed Return paginated list of layouts
   */
  public function getLayouts() {
    $layouts = Layouts::layouts()->paginate(Layouts::getPageSize());

    return response()->json($layouts);
  }

  /**
   * Gets list of all layouts
   *
   * @return mixed Return list of all layouts
   */
  public function getAllLayouts() {
    $layouts = Layouts::layouts()->get();

    return response()->json($layouts);
  }

  /**
   * Gets layout by layoutId
   *
   * @param string $layoutId
   * @return mixed Returns layout or 404 status code when layout is not found
   */
  public function getLayout(int $layoutId) {
    $layout = Layouts::layout($layoutId);

    if (isset($layout)) {
      return response()->json($layout);
    } else {
      return response('', 404);
    }
  }

  /**
   * Creates new layout
   *
   * @param Illuminate\Http\Request $request
   * @return mixed Returns id of created layout
   */
  public function createLayout(Request $request) {
    $this->validate($request, [
      'name' => 'required|max:255|unique:layouts',
    ]);

    $id = DB::table('layouts')->insertGetId([
      'name' => $request->input('name'),
    ]);

    return response()->json(['id' => $id]);
  }

  /**
   * Updates layout
   *
   * @param Illuminate\Http\Request $request
   * @param int $layoutId
   * @return void Returns 204 or 404 when layout is not found
   */
  public function updateLayout(Request $request, int $layoutId) {
    $layout = Layouts::layout($layoutId);

    if (isset($layout)) {
      $this->validate($request, [
        'name' => "max:255|unique:layouts,name,{$layout->id}",
      ]);

      DB::table('layouts')
        ->where('id', '=', $layoutId)
        ->update([
          'name' => $request->input('name', $layout->name),
          'modified_at' => date('Y-m-d H:i:s'),
        ]);

      return response('', 204);
    } else {
      return response('', 404);
    }
  }

  /**
   * Deletes layout

   * @param int $layoutId
   * @return void Returns 204 status code or 404 when layout is not found
   */
  public function deleteLayout(int $layoutId) {
    $layout = Layouts::layout($layoutId);

    if (isset($layout)) {
      DB::transaction(function () use ($layoutId) {
        DB::table('layouts')
          ->where('id', '=', $layoutId)
          ->delete();

        DB::table('layout_slots')
          ->where('layout_id', '=', $layoutId)
          ->delete();
      });

      return response('', 204);
    } else {
      return response('', 404);
    }
  }
}
