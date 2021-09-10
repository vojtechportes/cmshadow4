<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateModulesTable extends Migration {
  /**
   * Run the migrations.
   *
   * @return void
   */
  public function up() {
    Schema::create('modules', function (Blueprint $table) {
      $table->bigIncrements('id');
      $table
        ->string('identifier', 255)
        ->nullable()
        ->default(null); // Maybe not necessary
      $table
        ->string('page_identifier', 255)
        ->nullable()
        ->default(null); // Only for page type
      $table
        ->integer('page_version')
        ->nullable()
        ->default(null); // Only for page type
      $table
        ->integer('template_page_id')
        ->nullable()
        ->default(null); // Only for template page type
      $table->integer('layout_id');
      $table->integer('slot_id');
      $table->integer('weight')->default(50);
      $table->enum('page_type', ['PAGE', 'TEMPLATE_PAGE']);
      $table->enum('module_type', [
        'TEXT',
        'GALLERY',
        'IMAGE',
        'HEADING',
        'NAVIGATION',
        'LOGO',
        'CATALOG_CATEGORY_TREE',
        'CATALOG_LISTING',
        'CATALOG_DETAIL',
        'FORM',
        'HTML',
      ]);

      $table->index('page_identifier');
      $table->index('page_version');
      $table->index('template_page_id');
      $table->index('layout_id');
      $table->index('slot_id');
      $table->index('weight');
      $table->index('page_type');
      $table->index('module_type');
    });
  }

  /**
   * Reverse the migrations.
   *
   * @return void
   */
  public function down() {
    Schema::dropIfExists('modules');
  }
}
