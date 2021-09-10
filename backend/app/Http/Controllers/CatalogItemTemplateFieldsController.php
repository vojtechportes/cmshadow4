<?php

namespace App\Http\Controllers;

use App\CatalogItemTemplateFields;
use App\CatalogItemTemplates;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;

class CatalogItemTemplateFieldsController extends Controller {
  /**
   * Gets paginated list of catalog item template fields by
   * catalogItemTemplateId
   *
   * @param int $catalogItemTemplateId
   * @return mixed Returns paginated list of catalog item template fields
   */
  public function getCatalogItemTemplateFields(int $catalogItemTemplateId) {
    $catalogItemTemplateFields = CatalogItemTemplateFields::catalogItemTemplateFields(
      $catalogItemTemplateId
    )
      ->orderBy('weight', 'ASC')
      ->paginate(CatalogItemTemplateFields::getPageSize());

    return response()->json($catalogItemTemplateFields);
  }

  /**
   * Gets catalog item template field by catalogItemTemplateFieldId
   *
   * @param int $catalogItemTemplateFieldId
   * @return mixed Returns catalog item template field or 404 status code
   *               when catalog item template field is not found
   */
  public function getCatalogItemTemplateField(int $catalogItemTemplateFieldId) {
    $catalogItemTemplateField = CatalogItemTemplateFields::catalogItemTemplateField(
      $catalogItemTemplateFieldId
    );

    if (isset($catalogItemTemplateField)) {
      return response()->json($catalogItemTemplateField);
    } else {
      return response('', 404);
    }
  }

  /**
   * Creates new catalog item template field
   *
   * @param int $catalogItemTemplateId
   * @param Illuminate\Http\Request $request
   * @return mixed Returns id of created catalog item template field
   */
  public function createCatalogItemTemplateField(
    Request $request,
    int $catalogItemTemplateId
  ) {
    $catalogItemTemplate = CatalogItemTemplates::catalogItemTemplate(
      $catalogItemTemplateId
    );

    if (isset($catalogItemTemplate)) {
      $this->validate($request, [
        'template_group_id' => 'numeric|nullable',
        'is_multilungual' => 'boolean',
        'name' => [
          'required',

          /**
           * Validates whether name already exists for given template id
           */
          Rule::unique('catalog_item_template_fields', 'name')->where(function (
            $query
          ) use ($catalogItemTemplateId) {
            $query->where('template_id', '=', $catalogItemTemplateId);
          }),
        ],
        'key' => [
          'required',
          'alpha_dash',

          /**
           * Validates whether key already exists for given template id
           */
          Rule::unique('catalog_item_template_fields', 'key')->where(function (
            $query
          ) use ($catalogItemTemplateId) {
            $query->where('template_id', '=', $catalogItemTemplateId);
          }),
        ],
        'type' => [
          'required',
          Rule::in([
            'RICH_TEXT',
            'TEXT',
            'STRING',
            'INTEGER',
            'BOOLEAN',
            'DATE',
            'DATE_TIME',
            'IMAGE',
            'GALLERY',
            'LINK',
            'PRICE',
            'TAX_RATE',
          ]),
        ],
        'default_value' => 'string',
        'use_in_listing' => 'boolean',
        'is_sortable' => 'boolean',
        'is_searchable' => 'boolean',
        'weight' => 'numeric',
      ]);

      $id = DB::table('catalog_item_template_fields')->insertGetId([
        'template_id' => $catalogItemTemplateId,
        'template_group_id' => $request->input('template_group_id', null),
        'is_multilingual' => $request->input('is_multilingual', 0),
        'name' => $request->input('name'),
        'key' => $request->input('key'),
        'type' => $request->input('type'),
        'default_value' => $request->input('default_value', null),
        'use_in_listing' => $request->input('use_in_listing', 0),
        'is_sortable' => $request->input('is_sortable', 0),
        'is_searchable' => $request->input('is_searchable', 0),
        'weight' => $request->input('weight', 50),
      ]);

      return response()->json(['id' => $id]);
    } else {
      return response('', 404);
    }
  }

  /**
   * Updates catalog item template field
   *
   * @param Illuminate\Http\Request $request
   * @param int $catalogItemTemplateId
   * @param int $catalogItemTemplateFieldId
   * @return void Returns 204 or 404 when catalog item template or template field is not found
   */
  public function updateCatalogItemTemplateField(
    Request $request,
    int $catalogItemTemplateId,
    int $catalogItemTemplateFieldId
  ) {
    $catalogItemTemplate = CatalogItemTemplates::catalogItemTemplate(
      $catalogItemTemplateId
    );

    $catalogItemTemplateField = CatalogItemTemplateFields::catalogItemTemplateField(
      $catalogItemTemplateFieldId
    );

    if (isset($catalogItemTemplate) && isset($catalogItemTemplateField)) {
      $this->validate($request, [
        'template_group_id' => 'numeric|nullable',
        'is_multilungual' => 'boolean',
        'name' => [
          /**
           * Validates whether name already exists for given template id
           */
          Rule::unique('catalog_item_template_fields', 'name')->where(function (
            $query
          ) use ($catalogItemTemplateId, $catalogItemTemplateFieldId) {
            $query
              ->where('template_id', '=', $catalogItemTemplateId)
              ->where('id', '!=', $catalogItemTemplateFieldId);
          }),
        ],
        'key' => [
          'alpha_dash',
          /**
           * Validates key name already exists for given template id
           */
          Rule::unique('catalog_item_template_fields', 'key')->where(function (
            $query
          ) use ($catalogItemTemplateId, $catalogItemTemplateFieldId) {
            $query
              ->where('template_id', '=', $catalogItemTemplateId)
              ->where('id', '!=', $catalogItemTemplateFieldId);
          }),
        ],
        'type' => [
          Rule::in([
            'RICH_TEXT',
            'TEXT',
            'STRING',
            'INTEGER',
            'BOOLEAN',
            'DATE',
            'DATE_TIME',
            'IMAGE',
            'GALLERY',
            'LINK',
            'PRICE',
            'TAX_RATE',
          ]),
        ],
        'default_value' => 'string',
        'use_in_listing' => 'boolean',
        'is_sortable' => 'boolean',
        'is_searchable' => 'boolean',
        'weight' => 'numeric',
      ]);

      DB::transaction(function () use (
        $catalogItemTemplateFieldId,
        $catalogItemTemplateField,
        $request
      ) {
        DB::table('catalog_item_template_fields')
          ->where('id', '=', $catalogItemTemplateFieldId)
          ->update([
            'template_group_id' => $request->input(
              'template_group_id',
              $catalogItemTemplateField->template_group_id
            ),
            'is_multilingual' => $request->input(
              'is_multilingual',
              $catalogItemTemplateField->is_multilingual
            ),
            'name' => $request->input('name', $catalogItemTemplateField->name),
            'key' => $request->input('key', $catalogItemTemplateField->key),
            'type' => $request->input('type', $catalogItemTemplateField->type),
            'default_value' => $request->input(
              'default_value',
              $catalogItemTemplateField->default_value
            ),
            'use_in_listing' => $request->input(
              'use_in_listing',
              $catalogItemTemplateField->use_in_listing
            ),
            'is_sortable' => $request->input(
              'is_sortable',
              $catalogItemTemplateField->is_sortable
            ),
            'is_searchable' => $request->input(
              'is_searchable',
              $catalogItemTemplateField->is_searchable
            ),
            'weight' => $request->input(
              'weight',
              $catalogItemTemplateField->weight
            ),
          ]);

        $oldType = $catalogItemTemplateField->type;
        $newType = $request->input('type', $oldType);

        $dateTypes = ['DATE', 'DATE_TIME'];
        $transitionTypes = ['GALLERY', 'IMAGE', 'DATE', 'DATE_TIME'];

        if ($oldType !== $newType) {
          if (
            in_array($newType, $transitionTypes) &&
            !(in_array($oldType, $dateTypes) && in_array($newType, $dateTypes))
          ) {
            DB::table('catalog_item_template_field_values')
              ->where('field_id', '=', $catalogItemTemplateFieldId)
              ->update(['value' => '']);
          }
        }
      });

      /* TODO figure out what to do with multilingual items when non multi lingual
       item is switch to multilingual and vice versa */

      return response('', 204);
    } else {
      return response('', 404);
    }
  }

  /**
   * Deletes catalog item template field and item tempalte field values
   *
   * @param int $catalogItemTemplateId
   * @param int $catalogItemTemplateFieldId
   * @return void Returns 204 status code or 404 when catalog item template field is not found
   */
  public function deleteCatalogItemTemplateField(
    int $catalogItemTemplateId,
    int $catalogItemTemplateFieldId
  ) {
    $catalogItemTemplate = CatalogItemTemplates::catalogItemTemplate(
      $catalogItemTemplateId
    );

    $catalogItemTemplateField = CatalogItemTemplateFields::catalogItemTemplateField(
      $catalogItemTemplateFieldId
    );

    if (isset($catalogItemTemplate) && isset($catalogItemTemplateField)) {
      DB::transaction(function () use ($catalogItemTemplateFieldId) {
        DB::table('catalog_item_template_fields')
          ->where('id', '=', $catalogItemTemplateFieldId)
          ->delete();

        DB::table('catalog_item_template_field_values')
          ->where('field_id', '=', $catalogItemTemplateFieldId)
          ->delete();
      });

      return response('', 204);
    } else {
      return response('', 404);
    }
  }
}
