<?php

namespace App\Http\Controllers;

use App\CatalogItemTemplateFieldValues;
use App\CatalogItemTemplateFields;
use App\CatalogItemTemplates;
use App\CatalogLanguages;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;
use Intervention\Image\ImageManagerStatic as Image;

class CatalogItemTemplateFieldValuesController extends Controller {
  /**
   * Gets a validation method based on field type
   *
   * @param string $fieldType
   * @return string
   */
  private function getValidation(string $fieldType) {
    switch ($fieldType) {
      case 'RICH_TEXT':
      case 'TEXT':
      case 'STRING':
      case 'LINK':
      default:
        return 'string';
        break;
      case 'IMAGE':
      case 'GALLERY':
        return 'image';
        break;
      case 'IMAGE_VALUE':
      case 'GALLERY_VALUES':
        return 'string';
        break;
      case 'INTEGER':
        return 'numeric';
        break;
      case 'DATE':
      case 'DATE_TIME':
        return 'date';
        break;
      case 'BOOLEAN':
        return 'boolean';
        break;
    }
  }

  /**
   * Gets a field path
   *
   * @param int $fieldId
   * @param string $fieldType
   * @param mixed $fieldLanguage
   * @return string
   */
  private function getExpectedFieldPath(
    int $fieldId,
    string $fieldType,
    $fieldLanguage = null
  ) {
    $pathLanguage = $fieldLanguage === null ? "" : ".{$fieldLanguage->code}";

    switch ($fieldType) {
      case 'IMAGE':
      case 'GALLERY':
        return [
          "value" => "fields.{$fieldId}{$pathLanguage}.value",
          "extra_content" => "fields.{$fieldId}{$pathLanguage}.extra_content",
        ];
        break;
      default:
        return [
          "value" => "fields.{$fieldId}{$pathLanguage}.value",
          "extra_content" => "fields.{$fieldId}{$pathLanguage}.extra_content",
        ];
        break;
    }
  }

  /**
   * Inserts or update catalog item template field value
   *
   * @param array $field
   * @param mixed $value
   * @param int $itemId
   * @return void
   */
  private function insertOrUpdate(array $field, $value, int $itemId) {
    if ($field['exists'] === true) {
      DB::table('catalog_item_template_field_values')
        ->where('field_id', '=', $field['field_id'])
        ->where('item_id', '=', $itemId)
        ->where('language', '=', $field['field_language'])
        ->update([
          'value' =>
            $field['type'] === 'GALLERY' || $field['type'] === 'IMAGE'
              ? json_encode($value)
              : $value,
          'extra_content' =>
            $field['extra_content'] !== null && $field['type'] !== 'GALLERY'
              ? $field['extra_content']
              : null,
        ]);
    } else {
      DB::table('catalog_item_template_field_values')->insert([
        'field_id' => $field['field_id'],
        'item_id' => $itemId,
        'language' => $field['field_language'],
        'value' =>
          $field['type'] === 'GALLERY' || $field['type'] === 'IMAGE'
            ? json_encode($value)
            : $value,
        'extra_content' =>
          $field['extra_content'] !== null && $field['type'] !== 'GALLERY'
            ? $field['extra_content']
            : null,
      ]);
    }
  }

  /**
   * Updates catalog item template field values
   *
   * @param Illuminate\Http\Request $request
   * @param int $catalogItemTemplateId
   * @return void Returns 204 or 404 when catalog item template or template field is not found
   */
  public function updateCatalogItemTemplateFieldValues(
    Request $request,
    int $catalogItemTemplateId
  ) {
    $this->validate($request, [
      'item_id' => 'required|numeric|exists:catalog_items,id',
    ]);

    $catalogItemTemplate = CatalogItemTemplates::catalogItemTemplate(
      $catalogItemTemplateId
    );

    if (isset($catalogItemTemplate)) {
      $expectedFields = [];
      $validation = [];
      $templateFields = CatalogItemTemplateFields::catalogItemTemplateFields(
        $catalogItemTemplateId
      )->get();

      $templateFieldValues = DB::table('catalog_item_template_field_values')
        ->where('item_id', '=', $request->input('item_id'))
        ->get()
        ->toArray();

      foreach ($templateFields as &$field) {
        $transformedValues = [];
        $values = array_filter($templateFieldValues, function ($item) use (
          $field
        ) {
          return $item->field_id === $field->id;
        });

        foreach ($values as $value) {
          $transformedValues[
            $value->language === null ? "null" : $value->language
          ] = $value;
        }

        $field->data = (object) $transformedValues;
      }

      $catalogLanguages = CatalogLanguages::catalogLanguages()
        ->select('code')
        ->get();

      /**
       * Set validation methods and expectedFields array
       * for multilingual and non multilingual fields
       */
      foreach ($templateFields as $field) {
        /** Multilingual */
        if ((bool) $field->is_multilingual) {
          foreach ($catalogLanguages as $language) {
            $value = "";
            $extraContent = null;
            $exists = false;

            if (isset($field->data->{$language->code})) {
              $value = $field->data->{$language->code}->value;
              $extraContent = $field->data->{$language->code}->extra_content;
              $exists = true;
            }

            $fieldPath = $this->getExpectedFieldPath(
              $field->id,
              $field->type,
              $language
            );

            array_push($expectedFields, [
              "type" => $field->type,
              "field_id" => $field->id,
              "field_language" => $language->code,
              "value" => $request->input($fieldPath['value'], $value),
              "extra_content" => $request->input(
                $fieldPath['extra_content'],
                $extraContent
              ),
              "original_value" => $value,
              "exists" => $exists,
            ]);

            if ($field->type === 'GALLERY') {
              $validation[
                "fields.{$field->id}.{$language->code}.value"
              ] = $this->getValidation("GALLERY_VALUE");

              $validation[
                "fields.{$field->id}.{$language->code}.images.*"
              ] = $this->getValidation($field->type);
            } elseif ($field->type === 'IMAGE') {
              $validation[
                "fields.{$field->id}.{$language->code}.value"
              ] = $this->getValidation("IMAGE_VALUE");

              $validation[
                "fields.{$field->id}.{$language->code}.image"
              ] = $this->getValidation($field->type);
            } else {
              $validation[
                "fields.{$field->id}.{$language->code}.value"
              ] = $this->getValidation($field->type);
            }
          }
        } else {
          $value = "";
          $extraContent = null;
          $exists = false;

          if (isset($field->data->null)) {
            $value = $field->data->null->value;
            $extraContent = $field->data->null->extra_content;
            $exists = true;
          }

          $fieldPath = $this->getExpectedFieldPath($field->id, $field->type);

          array_push($expectedFields, [
            "type" => $field->type,
            "field_id" => $field->id,
            "field_language" => null,
            "value" => $request->input($fieldPath['value'], $value),
            "extra_content" => $request->input(
              $fieldPath['extra_content'],
              $extraContent
            ),
            "original_value" => $value,
            "exists" => $exists,
          ]);

          if ($field->type === 'GALLERY') {
            $validation["fields.{$field->id}.value"] = $this->getValidation(
              "GALLERY_VALUE"
            );

            $validation["fields.{$field->id}.images.*"] = $this->getValidation(
              $field->type
            );
          } elseif ($field->type === 'IMAGE') {
            $validation["fields.{$field->id}.value"] = $this->getValidation(
              "IMAGE_VALUE"
            );

            $validation["fields.{$field->id}.image"] = $this->getValidation(
              $field->type
            );
          } else {
            $validation["fields.{$field->id}.value"] = $this->getValidation(
              $field->type
            );
          }
        }
      }

      $this->validate($request, $validation);

      /**
       * Save data to database / upload files
       */
      foreach ($expectedFields as $expectedField) {
        switch ($expectedField['type']) {
          case 'GALLERY':
            $fieldLanguage = "";

            if ($expectedField['field_language']) {
              $fieldLanguage = ".{$expectedField['field_language']}";
            }

            $images = $request->file(
              "fields.{$expectedField['field_id']}{$fieldLanguage}.images"
            );
            $hasImages = $request->hasFile(
              "fields.{$expectedField['field_id']}{$fieldLanguage}.images"
            );

            $value =
              $expectedField['value'] === ""
                ? []
                : json_decode($expectedField['value']);
            $inputValue = $value;

            $originalValue =
              $expectedField['original_value'] === ""
                ? []
                : json_decode($expectedField['original_value']);

            if ($hasImages) {
              Image::configure(['driver' => env('IMAGE_DRIVER', 'gd')]);

              foreach ($images as $key => $image) {
                $uuid = CatalogItemTemplateFieldValues::getUUID();
                $fileName = $uuid . '.' . $image->extension();
                $fileNameTh = $uuid . '_th.' . $image->extension();
                $filePath = realpath(base_path(CMS_UPLOAD_IMAGE_CATALOG_PATH));

                if ($image->move($filePath, $fileName)) {
                  // Resize the image thumbnail and save
                  $imageTh = Image::make($filePath . '/' . $fileName);
                  $imageTh->resize(
                    SETTINGS_CATALOG_TH_IMAGE_WIDTH,
                    SETTINGS_CATALOG_TH_IMAGE_HEIGHT,
                    function ($constraint) {
                      $constraint->aspectRatio();
                      $constraint->upsize();
                    }
                  );
                  $imageTh->save(
                    $filePath . '/' . $fileNameTh,
                    SETTINGS_CATALOG_TH_IMAGE_QUALITY
                  );

                  // Resize the image and save
                  $imageOriginal = Image::make($filePath . '/' . $fileName);
                  $imageOriginal->resize(
                    SETTINGS_CATALOG_IMAGE_WIDTH,
                    SETTINGS_CATALOG_IMAGE_HEIGHT,
                    function ($constraint) {
                      $constraint->aspectRatio();
                      $constraint->upsize();
                    }
                  );
                  $imageOriginal->save(
                    $filePath . '/' . $fileName,
                    SETTINGS_CATALOG_IMAGE_QUALITY
                  );

                  array_push($value, [
                    'image' => $fileName,
                    'thumbnail' => $fileNameTh,
                    'title' => $request->input(
                      "fields.{$expectedField['field_id']}{$fieldLanguage}.extra_content.{$key}.title",
                      ""
                    ),
                    'description' => $request->input(
                      "fields.{$expectedField['field_id']}{$fieldLanguage}.extra_content.{$key}.description",
                      ""
                    ),
                  ]);
                }
              }
            }

            $originalValueImages = [];
            $valueImages = [];

            // TODO replace with foreach
            if (is_array($originalValue)) {
              array_map(function ($item) use (&$originalValueImages) {
                array_push($originalValueImages, $item->image);
                array_push($originalValueImages, $item->thumbnail);
              }, $originalValue);
            }

            // TODO replace with foreach
            if (is_array($inputValue)) {
              array_map(function ($item) use (&$valueImages) {
                $item = (object) $item;

                array_push($valueImages, $item->image);
                array_push($valueImages, $item->thumbnail);
              }, $inputValue);
            }

            // List of images for removal based on diff between old and new values
            $valuesDiff = array_diff($originalValueImages, $valueImages);

            // Unlink images
            foreach ($valuesDiff as $valueDiff) {
              $fileImage = realpath(
                base_path(CMS_UPLOAD_IMAGE_CATALOG_PATH . '/' . $valueDiff)
              );

              if (file_exists($fileImage)) {
                unlink($fileImage);
              }
            }

            $this->insertOrUpdate(
              $expectedField,
              $value,
              $request->input('item_id')
            );
            break;
          case 'IMAGE':
            $value =
              $expectedField['value'] === ""
                ? []
                : (array) json_decode($expectedField['value']);

            $originalValue =
              $expectedField['original_value'] === ""
                ? []
                : (array) json_decode($expectedField['original_value']);

            $image = $request->file(
              "fields.{$expectedField['field_id']}.image"
            );
            $hasImage = $request->hasFile(
              "fields.{$expectedField['field_id']}.image"
            );

            if ($hasImage) {
              $uuid = CatalogItemTemplateFieldValues::getUUID();
              $fileName = $uuid . '.' . $image->extension();
              $fileNameTh = $uuid . '_th.' . $image->extension();
              $filePath = realpath(base_path(CMS_UPLOAD_IMAGE_CATALOG_PATH));

              if ($image->move($filePath, $fileName)) {
                // Resize the image thumbnail and save
                $imageTh = Image::make($filePath . '/' . $fileName);
                $imageTh->resize(
                  SETTINGS_CATALOG_TH_IMAGE_WIDTH,
                  SETTINGS_CATALOG_TH_IMAGE_HEIGHT,
                  function ($constraint) {
                    $constraint->aspectRatio();
                    $constraint->upsize();
                  }
                );
                $imageTh->save(
                  $filePath . '/' . $fileNameTh,
                  SETTINGS_CATALOG_TH_IMAGE_QUALITY
                );

                // Resize the image and save
                $imageOriginal = Image::make($filePath . '/' . $fileName);
                $imageOriginal->resize(
                  SETTINGS_CATALOG_IMAGE_WIDTH,
                  SETTINGS_CATALOG_IMAGE_HEIGHT,
                  function ($constraint) {
                    $constraint->aspectRatio();
                    $constraint->upsize();
                  }
                );
                $imageOriginal->save(
                  $filePath . '/' . $fileName,
                  SETTINGS_CATALOG_IMAGE_QUALITY
                );

                $value['image'] = $fileName;
                $value['thumbnail'] = $fileNameTh;

                if ($originalValue !== []) {
                  $fileImage = realpath(
                    base_path(
                      CMS_UPLOAD_IMAGE_CATALOG_PATH .
                        '/' .
                        $originalValue['image']
                    )
                  );

                  $fileImageTh = realpath(
                    base_path(
                      CMS_UPLOAD_IMAGE_CATALOG_PATH .
                        '/' .
                        $originalValue['thumbnail']
                    )
                  );

                  if (file_exists($fileImage)) {
                    unlink($fileImage);
                  }

                  if (file_exists($fileImageTh)) {
                    unlink($fileImageTh);
                  }
                }
              }
            }

            $this->insertOrUpdate(
              $expectedField,
              $value,
              $request->input('item_id')
            );
            break;
          default:
            $this->insertOrUpdate(
              $expectedField,
              $expectedField['value'],
              $request->input('item_id')
            );
            break;
        }
      }
    }
  }
}
