<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTemplatesTable extends Migration {
  /**
   * Run the migrations.
   *
   * @return void
   */
  public function up() {
    Schema::create('templates', function (Blueprint $table) {
      $table->bigIncrements('id');
      $table->integer('layout_id');
      $table->integer('view_id');
      $table->string('name', 255);
      $table->binary('html_head_end')->default('');
      $table->binary('html_body_start')->default('');
      $table->binary('html_body_end')->default('');
      $table->timestamp('created_at', 0)->useCurrent();
      $table
        ->timestamp('modified_at', 0)
        ->nullable()
        ->default(null);
      $table->integer('created_by');
      $table
        ->integer('modified_by')
        ->nullable()
        ->default(null);

      $table->index('layout_id');
      $table->index('view_id');
      $table->index('name');
    });
  }

  /**
   * Reverse the migrations.
   *
   * @return void
   */
  public function down() {
    Schema::dropIfExists('tempaltes');
  }
}
