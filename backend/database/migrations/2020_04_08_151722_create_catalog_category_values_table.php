<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCatalogCategoryValuesTable extends Migration {
  /**
   * Run the migrations.
   *
   * @return void
   */
  public function up() {
    Schema::create('catalog_category_values', function (Blueprint $table) {
      $table->bigIncrements('id');
      $table->integer('category_id');
      $table->string('language');
      $table->string('name');
      $table->binary('description')->default('');

      $table->index('category_id');
      $table->index('language');
      $table->index('name');
    });
  }

  /**
   * Reverse the migrations.
   *
   * @return void
   */
  public function down() {
    Schema::dropIfExists('catalog_category_values');
  }
}
