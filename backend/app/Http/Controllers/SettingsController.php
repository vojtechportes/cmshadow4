<?php

namespace App\Http\Controllers;

use App\Settings;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;

class SettingsController extends Controller {
  /**
   * Gets list of settings by categoryId
   *
   * @param Illuminate\Http\Request $request
   * @return mixed Returns list of settings
   */
  public function getSettings(Request $request) {
    $categoryId = $request->input('category_id');

    $settings = Settings::settings($categoryId)->get();

    return response()->json($settings);
  }

  /**
   * Gets setting by settingId
   *
   * @param string $settingId
   * @return mixed Returns setting or 404 status code when setting is not found
   */
  public function getSetting(int $settingId) {
    $setting = Settings::setting($settingId);

    if (isset($setting)) {
      return response()->json($setting);
    } else {
      return response('', 404);
    }
  }

  /**
   * Creates new setting
   *
   * @param Illuminate\Http\Request $request
   * @return mixed Returns id of created setting
   */
  public function createSetting(Request $request) {
    $this->validate($request, [
      'category_id' => 'numeric|exists:settings_categories,id',
      'key' => 'required|unique:settings',
      'value_type' => 'required',
      'weight' => 'numeric',
    ]);

    $id = DB::table('settings')->insertGetId([
      'category_id' => $request->input('category_id', null),
      'key' => $request->input('key'),
      'value_type' => $request->input('value_type', 'STRING'),
      'options' => $request->input('options', 'null'),
      'value' => $request->input('value', null),
      'weight' => $request->input('weight', 50),
    ]);

    return response()->json(['id' => $id]);
  }

  /**
   * Updates setting
   *
   * @param Illuminate\Http\Request $request
   * @param int $settingId
   * @return void Returns 204 or 404 when setting is not found
   */
  public function updateSetting(Request $request, int $settingId) {
    $setting = Settings::setting($settingId);

    if (isset($setting)) {
      $this->validate($request, [
        'category_id' => 'numeric|exists:settings_categories,id',
        'weight' => 'numeric',
      ]);

      DB::table('settings')
        ->where('id', '=', $settingId)
        ->update([
          'category_id' => $request->input(
            'category_id',
            $setting->category_id
          ),
          'options' => $request->input('options', $setting->options),
          'value' => $request->input('value', $setting->value),
          'weight' => $request->input('weight', $setting->weight),
        ]);

      return response('', 204);
    } else {
      return response('', 404);
    }
  }

  /**
   * Deletes setting

   * @param int $settingId
   * @return void Returns 204 status code or 404 when setting is not found
   */
  public function deleteSetting(int $settingId) {
    $setting = Settings::setting($settingId);

    if (isset($setting)) {
      DB::table('settings')
        ->where('id', '=', $settingId)
        ->delete();

      return response('', 204);
    } else {
      return response('', 404);
    }
  }
}
