<?php

namespace App\Http\Controllers;

use App\Buttons;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ButtonsController extends Controller {
  /**
   * Gets paginated list of buttons
   *
   * @return mixed Returns paginated list of buttons
   */
  public function getButtons() {
    $buttons = Buttons::buttons()->paginate(Buttons::getPageSize());

    return response()->json($buttons);
  }

  /**
   * Gets list of all buttons
   *
   * @return mixed Returns list of all buttons
   */
  public function getAllButtons() {
    $buttons = Buttons::buttons()->get();

    return response()->json($buttons);
  }

  /**
   * Gets button by buttonId
   *
   * @param int $buttonId
   * @return mixed Returns button or 404 status code when button is not found
   */
  public function getButton(int $buttonId) {
    $button = Buttons::button($buttonId);

    if (isset($button)) {
      return response()->json($button);
    } else {
      return response('', 404);
    }
  }

  /**
   * Creates new button
   *
   * @param Illuminate\Http\Request $request
   * @return mixed Returns id of created button
   */
  public function createButton(Request $request) {
    $this->validate($request, [
      'name' => 'required|max:255|unique:buttons,name',
      'class_name' => 'required|max:255',
    ]);

    $id = DB::table('buttons')->insertGetId([
      'name' => $request->input('name'),
      'class_name' => $request->input('class_name'),
    ]);

    return response()->json(['id' => $id]);
  }

  /**
   * Updates button
   *
   * @param Illuminate\Http\Request $request
   * @param int $buttonId
   * @return void Returns 204 or 404 when button is not found
   */
  public function updateButton(Request $request, int $buttonId) {
    $button = Buttons::button($buttonId);

    if (isset($button)) {
      $this->validate($request, [
        'name' => "max:255|unique:buttons,name,{$button->id}",
        'class_name' => "max:255",
      ]);

      DB::table('buttons')
        ->where('id', '=', $buttonId)
        ->update([
          'name' => $request->input('name', $button->name),
          'class_name' => $request->input('class_name', $button->class_name),
        ]);

      return response('', 204);
    } else {
      return response('', 404);
    }
  }

  /**
   * Deletes button

   * @param int $buttonId
   * @return void Returns 204 status code or 404 when button is not found
   */
  public function deleteButton(int $buttonId) {
    $button = Buttons::button($buttonId);

    if (isset($button)) {
      DB::table('buttons')
        ->where('id', '=', $buttonId)
        ->delete();

      return response('', 204);
    } else {
      return response('', 404);
    }
  }
}
