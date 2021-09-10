<?php

namespace App\Http\Controllers;

use App\TemplatePages;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;

class TemplatePagesController extends Controller {
  /**
   * Gets paginated list of template pages
   *
   * @return mixed Returns paginated list of template pages
   */
  public function getTemplatePages() {
    $templatePages = TemplatePages::templatePages()->paginate(
      TemplatePages::getPageSize()
    );

    return response()->json($templatePages);
  }

  /**
   * Gets list of all template pages
   *
   * @param Illuminate\Http\Request $request
   * @return mixed Returns list of all template pages
   */
  public function getAllTemplatePages(Request $request) {
    $this->validate($request, [
      'layout_id' => 'numeric|exists:layouts,id',
    ]);

    $layoutId = $request->input('layout_id');
    $templatePages = TemplatePages::templatePages();

    if (isset($layoutId)) {
      $templatePages->where('layout_id', $layoutId);
    }

    return response()->json($templatePages->get());
  }

  /**
   * Gets template page by templatePageId
   *
   * @param int $templatePageId
   * @return mixed Returns template page or 404 status when template page is not found
   */
  public function getTemplatePage(int $templatePageId) {
    $templatePage = TemplatePages::templatePage($templatePageId);

    if (isset($templatePage)) {
      return response()->json($templatePage);
    } else {
      return response('', 404);
    }
  }

  /**
   * Creates new template page
   *
   * @param Illuminate\Http\Request $request
   * @return mixed Returns id of created template page
   */
  public function createTemplatePage(Request $request) {
    $this->validate($request, [
      'name' => 'required|unique:template_pages|max:255',
      'layout_id' => 'required|numeric|exists:layouts,id',
    ]);

    $id = DB::table('template_pages')->insertGetId([
      'name' => $request->input('name'),
      'layout_id' => $request->input('layout_id'),
    ]);

    return response()->json(['id' => $id]);
  }

  public function updateTemplatePage(Request $request, string $templatePageId) {
    $templatePage = TemplatePages::templatePage($templatePageId);

    if (isset($templatePage)) {
      $this->validate($request, [
        'name' => "unique:template_pages,name,{$templatePage->id}|max:255",
        'layout_id' => [
          'exists:layouts,id',
          /**
           * Validates whether this template page is associated with any template
           * If so tempalte page and template needs to share the same layout
           */
          function ($attribute, int $value, $fail) use ($templatePage) {
            if ($templatePage->layout_id !== $value) {
              $errors = [];
              $templates = DB::table('templates_pages_binding')
                ->select('templates.layout_id', 'templates.name')
                ->join(
                  'templates',
                  'templates.id',
                  '=',
                  'templates_pages_binding.template_id'
                )
                ->where('template_page_id', '=', $templatePage->id)
                ->get();

              foreach ($templates as $template) {
                if ($template->layout_id !== $value) {
                  array_push($errors, "\"{$template->name}\"");
                }
              }

              if (count($errors) > 0) {
                $fail(
                  "This layout can't be used since this template page is associated with templates " .
                    implode(', ', $errors) .
                    " that are using different layout"
                );
              }
            }
          },
        ],
      ]);

      DB::table('template_pages')
        ->where('id', '=', $templatePageId)
        ->update([
          'name' => $request->input('name', $templatePage->name),
          'layout_id' => $request->input('layout_id', $templatePage->layout_id),
          'modified_at' => date('Y-m-d H:i:s'),
        ]);

      return response('', 204);
    } else {
      return response('', 404);
    }
  }

  /**
   * Deletes template page and all bindings from templates_pages_binding table

   * @param int $templatePageId
   * @return void Returns 204 status code, 404 status code when template 
   *              page is not found or 422 status code when page bindings
   *              cant't be deleted
   */
  public function deleteTemplatePage(int $templatePageId) {
    $templatePage = TemplatePages::templatePage($templatePageId);

    if (isset($templatePage)) {
      try {
        DB::table('template_pages')
          ->where('id', '=', $templatePageId)
          ->delete();

        DB::table('templates_pages_binding')
          ->where('template_page_id', '=', $templatePageId)
          ->delete();

        return response('', 204);
      } catch (Error $error) {
        return response('', 422);
      }
    } else {
      return response('', 404);
    }
  }
}
