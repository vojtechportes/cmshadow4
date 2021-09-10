<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEmailTemplatesTable extends Migration {
  /**
   * Run the migrations.
   *
   * @return void
   */
  public function up() {
    Schema::create('email_templates', function (Blueprint $table) {
      $table->bigIncrements('id');
      $table->enum('type', [
        'ORDER_NEW',
        'ORDER_ACCEPTED',
        'ORDER_REJECTED',
        'ORDER_CLOSED',
      ]);
      $table->binary('content');
      $table->string('language');
      $table->timestamp('created_at', 0)->useCurrent();
      $table
        ->timestamp('modified_at', 0)
        ->nullable()
        ->default(null);
    });
  }

  /**
   * Reverse the migrations.
   *
   * @return void
   */
  public function down() {
    Schema::dropIfExists('email_templates');
  }
}
