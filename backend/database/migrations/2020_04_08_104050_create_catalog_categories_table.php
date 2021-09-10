<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCatalogCategoriesTable extends Migration {
  /**
   * Run the migrations.
   *
   * @return void
   */
  public function up() {
    Schema::create('catalog_categories', function (Blueprint $table) {
      $table->bigIncrements('id');
      $table->string('name');
      $table
        ->integer('parent_id')
        ->nullable()
        ->default(null);
      $table->integer('weight')->default(50);
      $table->boolean('published')->default(false);

      $table->index('name');
      $table->index('parent_id');
    });
  }

  /**
   * Reverse the migrations.
   *
   * @return void
   */
  public function down() {
    Schema::dropIfExists('catalog_categories');
  }
}
