<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCatalogItemTemplateFieldValuesTable extends Migration {
  /**
   * Run the migrations.
   *
   * @return void
   */
  public function up() {
    Schema::create('catalog_item_template_field_values', function (
      Blueprint $table
    ) {
      $table->bigIncrements('id');
      $table->integer('item_id');
      $table->integer('field_id');
      $table
        ->string('language', 255)
        ->nullable()
        ->default(null);
      $table->binary('value')->default('');
      $table
        ->binary('extra_content')
        ->nullable()
        ->default(null);

      $table->index('item_id');
      $table->index('field_id');
      $table->index('language');
    });
  }

  /**
   * Reverse the migrations.
   *
   * @return void
   */
  public function down() {
    Schema::dropIfExists('catalog_item_template_field_values');
  }
}
