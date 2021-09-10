<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;

class FileManagerController extends Controller {
  /**
   * Uploads file to file folder
   *
   * max size of file is set to 10 MB via validation
   * method
   *
   * @param Illuminate\Http\Request $request
   *
   * @return mixed Returns full path to uploaded file
   */
  public function uploadFile(Request $request) {
    $this->validate($request, [
      'file' => 'required|file|max:10240',
    ]);

    if ($request->hasFile('file')) {
      $file = $request->file;

      $filePath = realpath(base_path(CMS_UPLOAD_FILE_PATH));
      $fileName = $file->getClientOriginalName();
      $fileName = iconv('UTF-8', 'ASCII//TRANSLIT', $fileName); // Replace accents
      $fileName = str_replace(' ', '_', $fileName); // Replace spaces by underscores
      $fullPath = asset(CMS_FILE_PATH . '/' . $fileName);

      if ($file->move($filePath, $fileName)) {
        return response()->json(["location" => $fullPath]);
      } else {
        return response('', 422);
      }
    }
  }
}
