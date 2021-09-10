<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCatalogItemCategoriesTable extends Migration {
  /**
   * Run the migrations.
   *
   * @return void
   */
  public function up() {
    Schema::create('catalog_item_categories', function (Blueprint $table) {
      $table->bigIncrements('id');
      $table->integer('item_id');
      $table->integer('category_id');

      $table->index('item_id');
      $table->index('category_id');
    });
  }

  /**
   * Reverse the migrations.
   *
   * @return void
   */
  public function down() {
    Schema::dropIfExists('catalog_item_categories');
  }
}
