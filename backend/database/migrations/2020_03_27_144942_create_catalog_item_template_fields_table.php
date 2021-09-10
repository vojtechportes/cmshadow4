<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCatalogItemTemplateFieldsTable extends Migration {
  /**
   * Run the migrations.
   *
   * @return void
   */
  public function up() {
    Schema::create('catalog_item_template_fields', function (Blueprint $table) {
      $table->bigIncrements('id');
      $table->integer('template_id');
      $table
        ->integer('template_group_id')
        ->nullable()
        ->default(null);
      $table->boolean('is_multilingual', false);
      $table->string('name');
      $table->enum('type', [
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
      ]);
      $table->string('default_value')->default('');
      $table->boolean('use_in_listing')->default(false);
      $table->boolean('is_sortable')->default(false);
      $table->boolean('is_searchable')->default(false);
      $table->integer('weight')->default(50);

      $table->index('template_id');
      $table->index('template_group_id');
      $table->index('is_multilingual');
      $table->index('name');
      $table->index('type');
      $table->index('use_in_listing');
      $table->index('is_sortable');
      $table->index('is_searchable');
      $table->index('weight');
    });
  }

  /**
   * Reverse the migrations.
   *
   * @return void
   */
  public function down() {
    Schema::dropIfExists('catalog_item_template_fields');
  }
}
