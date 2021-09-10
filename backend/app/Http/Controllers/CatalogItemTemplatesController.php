<?php

namespace App\Http\Controllers;

use App\CatalogItemTemplates;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;

class CatalogItemTemplatesController extends Controller {
  /**
   * Gets paginated list of catalog item templates
   *
   * @return mixed Returns paginated list of catalog item templates
   */
  public function getCatalogItemTemplates() {
    $catalogItemTemplates = CatalogItemTemplates::catalogItemTemplates()->paginate(
      CatalogItemTemplates::getPageSize()
    );

    return response()->json($catalogItemTemplates);
  }

  /**
   * Gets list of catalog item templates
   *
   * @return mixed Returns list of catalog item templates
   */
  public function getAllCatalogItemTemplates() {
    $catalogItemTemplates = CatalogItemTemplates::catalogItemTemplates()->get();

    return response()->json($catalogItemTemplates);
  }

  /**
   * Gets catalog item template by catalogItemTemplateId
   *
   * @param int $catalogItemTemplateId
   * @return mixed Returns catalog item template or 404 status code
   *               when catalog item template is not found
   */
  public function getCatalogItemTemplate(int $catalogItemTemplateId) {
    $catalogItemTemplate = CatalogItemTemplates::catalogItemTemplate(
      $catalogItemTemplateId
    );

    if (isset($catalogItemTemplate)) {
      return response()->json($catalogItemTemplate);
    } else {
      return response('', 404);
    }
  }

  /**
   * Creates new catalog item template
   *
   * @param Illuminate\Http\Request $request
   * @return mixed Returns id of created catalog item template
   */
  public function createCatalogItemTemplate(Request $request) {
    $this->validate($request, [
      'view_id' => 'required|exists:views,id',
      'name' => 'required|max:255|unique:catalog_item_templates',
      'path' => 'required|max:255|alpha_dash|unique:catalog_item_templates',
    ]);

    $id = DB::table('catalog_item_templates')->insertGetId([
      'view_id' => $request->input('view_id'),
      'name' => $request->input('name'),
      'path' => $request->input('path'),
    ]);

    return response()->json(['id' => $id]);
  }

  /**
   * Updates catalog item template
   *
   * @param Illuminate\Http\Request $request
   * @param int $catalogItemTemplateId
   * @return void Returns 204 or 404 when catalog item template is not found
   */
  public function updateCatalogItemTemplate(
    Request $request,
    int $catalogItemTemplateId
  ) {
    $catalogItemTemplate = CatalogItemTemplates::catalogItemTemplate(
      $catalogItemTemplateId
    );

    if (isset($catalogItemTemplate)) {
      $this->validate($request, [
        'view_id' => "exists:views,id",
        'name' => "max:255|unique:catalog_item_templates,name,{$catalogItemTemplate->id}",
        'path' => "max:255|alpha_dash|unique:catalog_item_templates,path,{$catalogItemTemplate->id}",
      ]);

      DB::table('catalog_item_templates')
        ->where('id', '=', $catalogItemTemplateId)
        ->update([
          'view_id' => $request->input(
            'view_id',
            $catalogItemTemplate->view_id
          ),
          'name' => $request->input('name', $catalogItemTemplate->name),
          'path' => $request->input('path', $catalogItemTemplate->path),
        ]);

      return response('', 204);
    } else {
      return response('', 404);
    }
  }

  /**
   * Deletes catalog item template

   * @param int $catalogItemTemplateId
   * @return void Returns 204 status code or 404 when catalog item template is not found
   */
  public function deleteCatalogItemTemplate(int $catalogItemTemplateId) {
    $catalogItemTemplate = CatalogItemTemplates::catalogItemTemplate(
      $catalogItemTemplateId
    );

    if (isset($catalogItemTemplate)) {
      DB::transaction(function () use ($catalogItemTemplateId) {
        DB::table('catalog_item_templates')
          ->where('id', '=', $catalogItemTemplateId)
          ->delete();

        $fields = DB::table('catalog_item_template_fields')->where(
          'template_id',
          '=',
          $catalogItemTemplateId
        );
        $fieldIds = [];

        foreach ($fields->get() as $field) {
          array_push($fieldIds, $field->id);
        }

        if (count($fieldIds) > 0) {
          DB::table('catalog_item_template_field_values')
            ->whereIn('field_id', $fieldIds)
            ->delete();

          $fields->delete();
        }
      });

      return response('', 204);
    } else {
      return response('', 404);
    }
  }
}
