<?php

namespace App\Http\Controllers;

use App\ImageModules;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ImageModulesController extends Controller {
  /**
   * Gets paginated list of image modules
   *
   * @return mixed Returns paginated list of image modules
   */
  public function getImageModules() {
    $imageModules = ImageModules::imageModules()->paginate(
      ImageModules::getPageSize()
    );

    return response()->json($imageModules);
  }

  /**
   * Gets image module by moduleId
   *
   * @param int $moduleId
   * @return mixed Returns text module or 404 status code when text module is not found
   */
  public function getImageModule(int $moduleId) {
    $imageModule = ImageModules::imageModule($moduleId);

    if (isset($imageModule)) {
      return response()->json($imageModule);
    } else {
      return response('', 404);
    }
  }

  /**
   * Creates new image module
   *
   * @param Illuminate\Http\Request $request
   * @return void
   */
  public function createImageModule(Request $request) {
    $this->validate($request, [
      'parent_id' => 'required|numeric',
    ]);

    if ($request->hasFile('image')) {
      $image = $request->image;

      $fileName = ImageModules::getUUID() . '.' . $image->extension();
      $filePath = realpath(base_path(CMS_UPLOAD_IMAGE_PATH));

      if ($image->move($filePath, $fileName)) {
        DB::table('image_modules')->insert([
          'parent_id' => $request->input('parent_id'),
          'file_name' => $fileName,
          'image_alt' => $request->input('image_alt', ''),
        ]);

        return response('', 204);
      } else {
        return response('', 422);
      }
    } else {
      return response('', 400);
    }
  }

  /**
   * Updates image module
   *
   * @param Illuminate\Http\Request $request
   * @param int $moduleId
   * @return void Returns 204 or 404 when image module is not found
   */
  public function updateImageModule(Request $request, int $moduleId) {
    $imageModule = ImageModules::imageModule($moduleId);

    if (isset($imageModule)) {
      if ($request->hasFile('image')) {
        $image = $request->image;
        $fileName = ImageModules::getUUID() . '.' . $image->extension();
        $filePath = realpath(base_path(CMS_UPLOAD_IMAGE_PATH));

        if ($image->move($filePath, $fileName)) {
          DB::table('image_modules')
            ->where('parent_id', '=', $moduleId)
            ->update([
              'file_name' => $fileName,
              'image_alt' => $request->input(
                'image_alt',
                $imageModule->image_alt
              ),
            ]);

          unlink(
            realpath(
              base_path(CMS_UPLOAD_IMAGE_PATH) . '/' . $imageModule->file_name
            )
          );

          return response('', 204);
        } else {
          return response('', 422);
        }
      } else {
        DB::table('image_modules')
          ->where('parent_id', '=', $moduleId)
          ->update([
            'image_alt' => $request->input(
              'image_alt',
              $imageModule->image_alt
            ),
          ]);

        return response('', 204);
      }
    } else {
      return response('', 404);
    }
  }

  /**
   * Deletes image module

   * @param int $moduleId
   * @return void Returns 204 status code or 404 when image module is not found
   */
  public function deleteImageModule(int $moduleId) {
    $imageModule = ImageModules::imageModule($moduleId);

    if (isset($imageModule)) {
      unlink(
        realpath(base_path(CMS_IMAGE_PATH) . '/' . $imageModule->file_name)
      );

      DB::table('image_modules')
        ->where('parent_id', '=', $moduleId)
        ->delete();

      return response('', 204);
    } else {
      return response('', 404);
    }
  }
}
