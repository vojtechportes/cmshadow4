<?php

namespace App\Http\Controllers;

use App\SettingsCategories;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;

class SettingsCategoriesController extends Controller {
  /**
   * Gets list of settings categories by parentId
   *
   * @param Illuminate\Http\Request $request
   * @return mixed Returns list of settings
   */
  public function getSettingsCategories(Request $request) {
    $parentId = $request->input('parent_id');

    $settingsCategories = SettingsCategories::settingsCategories(
      $parentId
    )->get();

    return response()->json($settingsCategories);
  }

  /**
   * Gets settings category by settingCategoryId
   *
   * @param string $settingCategoryId
   * @return mixed Returns settings category or 404 status code when
   *               settings category is not found
   */
  public function getSettingsCategory(int $settingCategoryId) {
    $settingsCategory = SettingsCategories::settingsCategory(
      $settingCategoryId
    );

    if (isset($settingsCategory)) {
      return response()->json($settingsCategory);
    } else {
      return response('', 404);
    }
  }

  /**
   * Creates new settings category
   *
   * @param Illuminate\Http\Request $request
   * @return mixed Returns id of created settings category
   */
  public function createSettingsCategory(Request $request) {
    $this->validate($request, [
      'parent_id' => 'numeric|exists:settings_categories,id',
      'key' => 'required|unique:settings_categories',
    ]);

    $id = DB::table('settings_categories')->insertGetId([
      'parent_id' => $request->input('parent_id', null),
      'key' => $request->input('key'),
      'weight' => $request->input('weight', 50),
    ]);

    return response()->json(['id' => $id]);
  }

  /**
   * Updates settings category
   *
   * @param Illuminate\Http\Request $request
   * @param int $settingsCategoryId
   * @return void Returns 204 or 404 when setting is not found
   */
  public function updateSettingsCategory(
    Request $request,
    int $settingsCategoryId
  ) {
    $settingsCategory = SettingsCategories::settingsCategory(
      $settingsCategoryId
    );

    if (isset($settingsCategory)) {
      $this->validate($request, [
        'parent_id' => 'numeric|exists:settings_categories,id',
        'weight' => 'numeric',
      ]);

      DB::table('settings_categories')
        ->where('id', '=', $settingsCategoryId)
        ->update([
          'parent_id' => $request->input(
            'parent_id',
            $settingsCategory->parent_id
          ),
          'weight' => $request->input('weight', $settingsCategory->weight),
        ]);

      return response('', 204);
    } else {
      return response('', 404);
    }
  }

  /**
   * Deletes settings category and sttings within the category

   * @param int $settingsCategoryId
   * @return void Returns 204 status code or 404 when settings category is not found
   */
  public function deleteSettingsCategory(int $settingsCategoryId) {
    $settingsCategory = SettingsCategories::settingsCategory(
      $settingsCategoryId
    );

    if (isset($settingsCategory)) {
      $settingsCategoryIds = SettingsCategories::getChildrenRecursive(
        $settingsCategory->id,
        'settings_categories',
        'parent_id'
      );

      DB::transaction(function () use ($settingsCategoryIds) {
        DB::table('settings_categories')
          ->whereIn('id', $settingsCategoryIds)
          ->delete();

        DB::table('settings')->whereIn('category_id', $settingsCategoryIds);
      });

      return response('', 204);
    } else {
      return response('', 404);
    }
  }
}
