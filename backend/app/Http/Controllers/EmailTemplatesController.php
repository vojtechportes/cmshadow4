<?php

namespace App\Http\Controllers;

use App\EmailTemplates;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;

class EmailTemplatesController extends Controller {
  /**
   * Gets paginated list of email templates
   *
   * @return mixed Return paginated list of email templates
   */
  public function getEmailTemplates() {
    $emailTemplates = EmailTemplates::emailTemplates()->paginate(
      EmailTemplates::getPageSize()
    );

    return response()->json($emailTemplates);
  }

  /**
   * Gets email template by emailTemplateId
   *
   * @param string $emailTemplateId
   * @return mixed Returns email template or 404 status code
   *               when email template is not found
   */
  public function getEmailTemplate(int $emailTemplateId) {
    $emailTemplate = EmailTemplates::emailTemplate($emailTemplateId);

    if (isset($emailTemplate)) {
      return response()->json($emailTemplate);
    } else {
      return response('', 404);
    }
  }

  /**
   * Creates new email template
   *
   * @param Illuminate\Http\Request $request
   * @return mixed Returns id of created email template
   */
  public function createEmailTemplate(Request $request) {
    $this->validate($request, [
      'type' => [
        'required',
        Rule::in([
          'ORDER_NEW',
          'ORDER_ACCEPTED',
          'ORDER_REJECTED',
          'ORDER_CLOSED',
        ]),
        Rule::unique('email_templates', 'type')->where(function ($query) use (
          $request
        ) {
          $query->where('language', '=', $request->input('language'));
        }),
      ],
      'content' => 'required:string',
      'language' => [
        'required',
        Rule::unique('email_templates', 'language')->where(function (
          $query
        ) use ($request) {
          $query->where('type', '=', $request->input('type'));
        }),
      ],
    ]);

    $id = DB::table('email_templates')->insertGetId([
      'type' => $request->input('type'),
      'content' => $request->input('content'),
      'language' => $request->input('language'),
    ]);

    return response()->json(['id' => $id]);
  }

  /**
   * Updates email template
   *
   * @param Illuminate\Http\Request $request
   * @param int $emailTemplateId
   * @return void Returns 204 or 404 when email template is not found
   */
  public function updateEmailTemplate(Request $request, int $emailTemplateId) {
    $emailTemplate = EmailTemplates::emailTemplate($emailTemplateId);

    if (isset($emailTemplate)) {
      $this->validate($request, [
        "type" => [
          Rule::in([
            'ORDER_NEW',
            'ORDER_ACCEPTED',
            'ORDER_REJECTED',
            'ORDER_CLOSED',
          ]),
          Rule::unique('email_templates', 'type')->where(function ($query) use (
            $emailTemplateId,
            $emailTemplate,
            $request
          ) {
            $query
              ->where(
                'language',
                '=',
                $request->input('language', $emailTemplate->language)
              )
              ->where('id', '!=', $emailTemplateId);
          }),
        ],
        "content" => "string",
        "language" => [
          "string",
          Rule::unique('email_templates', 'language')->where(function (
            $query
          ) use ($emailTemplateId, $emailTemplate, $request) {
            $query
              ->where(
                'type',
                '=',
                $request->input('type', $emailTemplate->type)
              )
              ->where('id', '!=', $emailTemplateId);
          }),
        ],
      ]);

      DB::table('email_templates')
        ->where('id', '=', $emailTemplateId)
        ->update([
          'type' => $request->input('type', $emailTemplate->type),
          "content" => $request->input('content', $emailTemplate->content),
          "language" => $request->input('language', $emailTemplate->language),
          'modified_at' => date('Y-m-d H:i:s'),
        ]);

      return response('', 204);
    } else {
      return response('', 404);
    }
  }

  /**
   * Deletes email template

   * @param int $emailTemplateId
   * @return void Returns 204 status code or 404 when email
   *              template is not found
   */
  public function deleteEmailTemplate(int $emailTemplateId) {
    $emailTemplate = EmailTemplates::emailTemplate($emailTemplateId);

    if (isset($emailTemplate)) {
      DB::table('email_templates')
        ->where('id', '=', $emailTemplateId)
        ->delete();

      return response('', 204);
    } else {
      return response('', 404);
    }
  }
}
