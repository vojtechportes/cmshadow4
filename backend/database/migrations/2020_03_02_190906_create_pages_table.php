<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePagesTable extends Migration {
  /**
   * Run the migrations.
   *
   * @return void
   */
  public function up() {
    Schema::create('pages', function (Blueprint $table) {
      $table->bigIncrements('id');
      $table->string('identifier', 255);
      $table->string('parent', 255);
      $table->string('name', 255);
      $table->integer('template_id');
      $table->string('path', 500);
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
      $table
        ->enum('status', ['DRAFT', 'PUBLISHED', 'UNPUBLISHED', 'DELETED'])
        ->default('DRAFT');
      $table->integer('version');

      $table->index('identifier');
      $table->index('parent');
      $table->index('name');
      $table->index('template_id');
      $table->index('path');
      $table->index('status');
      $table->index('version');
    });
  }

  /**
   * Reverse the migrations.
   *
   * @return void
   */
  public function down() {
    Schema::dropIfExists('pages');
  }
}
