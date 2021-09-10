<?php

namespace App\Http\Controllers;

use App\Templates;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;

class TemplatesController extends Controller {
  /**
   * Gets paginated list of templates
   *
   * @return mixed Returns paginated list of templates
   */
  public function getTemplates() {
    $pages = Templates::templates()->paginate(Templates::getPageSize());

    return response()->json($pages);
  }

  /**
   * Gets list of all templates
   *
   * @return mixed Returns list of all templates
   */
  public function getAllTemplates() {
    $pages = Templates::templates()->get();

    return response()->json($pages);
  }

  /**
   * Gets template by templateId
   *
   * @param string $templateId
   * @return mixed Returns template or 404 status code when template is not found
   */
  public function getTemplate(int $templateId) {
    $template = Templates::template($templateId);

    if (isset($template)) {
      $template_pages = Templates::templatePages($templateId);
      $template->template_pages = $template_pages;

      return response()->json($template);
    } else {
      return response('', 404);
    }
  }

  /**
   * Creates new template
   *
   * @param Illuminate\Http\Request $request
   * @return mixed Returns id of created template
   */
  public function createTemplate(Request $request) {
    $this->validate($request, [
      'layout_id' => 'required|exists:layouts,id',
      'view_id' => 'required|exists:views,id',
      'name' => 'required|max:255|unique:templates',
    ]);

    $id = DB::table('templates')->insertGetId([
      'layout_id' => $request->input('layout_id'),
      'view_id' => $request->input('view_id'),
      'name' => $request->input('name'),
      'html_head_end' => $request->input('html_head_end', ''),
      'html_body_start' => $request->input('html_body_start', ''),
      'html_body_end' => $request->input('html_body_end', ''),
    ]);

    return response()->json(['id' => $id]);
  }

  /**
   * Updates template
   *
   * @param Illuminate\Http\Request $request
   * @param int $templateId
   * @return mixed Returns 204 status code or 404 if template is not found
   */
  public function updateTemplate(Request $request, int $templateId) {
    $template = Templates::template($templateId);

    if (isset($template)) {
      $layoutId = $request->input('layout_id', $template->layout_id);

      $this->validate($request, [
        'layout_id' => 'exists:layouts,id',
        'view_id' => 'exists:views,id',
        'name' => "max:255|unique:templates,name,{$template->id}",
        'template_pages.*' => [
          /**
           * Validates whether template_page exists and if both template and template page
           * are using the same layout
           */
          Rule::exists('template_pages', 'id')->where(function ($query) use (
            $layoutId
          ) {
            $query->where('layout_id', $layoutId);
          }),
        ],
      ]);

      DB::table('templates')
        ->where('id', '=', $templateId)
        ->update([
          'layout_id' => $layoutId,
          'view_id' => $request->input('view_id', $template->view_id),
          'name' => $request->input('name', $template->name),
          'html_head_end' => $request->input(
            'html_head_end',
            $template->html_head_end
          ),
          'html_body_start' => $request->input(
            'html_body_start',
            $template->html_body_start
          ),
          'html_body_end' => $request->input(
            'html_body_end',
            $template->html_body_end
          ),
          'modified_at' => date('Y-m-d H:i:s'),
        ]);

      if (is_array($request->input('template_pages'))) {
        $data = [];

        foreach (
          $request->input('template_pages')
          as $weight => $templatePageId
        ) {
          array_push($data, [
            'template_id' => $templateId,
            'template_page_id' => $templatePageId,
            'weight' => $weight,
          ]);
        }

        DB::transaction(function () use ($templateId, $data) {
          /**
           * Delete all bindings to template first
           */
          DB::table('templates_pages_binding')
            ->where('template_id', '=', $templateId)
            ->delete();
          /**
           * Insert new bindings
           */
          DB::table('templates_pages_binding')->insert($data);
        });
        return response('', 204);
      } else {
        return response('', 204);
      }
    } else {
      return response('', 404);
    }
  }

  /**
   * Deletes template and all bindings from templates_pages_binding table

   * @param int $layoutId
   * @return void Returns 204 status code or 404 status code when template is not found
   */
  public function deleteTemplate(int $templateId) {
    $template = Templates::template($templateId);

    if (isset($template)) {
      DB::transaction(function () use ($templateId) {
        DB::table('templates')
          ->where('id', '=', $templateId)
          ->delete();

        DB::table('templates_pages_binding')
          ->where('template_id', '=', $templateId)
          ->delete();
      });

      return response('', 204);
    } else {
      return response('', 404);
    }
  }
}
