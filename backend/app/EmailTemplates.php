<?php

namespace App;

use App\BaseModel;
use Illuminate\Support\Facades\DB;

class EmailTemplates extends BaseModel {
  protected function emailTemplates() {
    return DB::table('email_templates')->orderBy('created_at', 'desc');
  }

  protected function emailTemplate(int $emailTemplateId) {
    return DB::table('email_templates')
      ->where('id', '=', $emailTemplateId)
      ->get()
      ->first();
  }
}
