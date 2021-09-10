<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCatalogCategoryTreeModulesTable extends Migration {
  /**
   * Run the migrations.
   *
   * @return void
   */
  public function up() {
    Schema::create('catalog_category_tree_modules', function (
      Blueprint $table
    ) {
      $table->integer('parent_id');
      $table
        ->integer('parent_category_id')
        ->nullable()
        ->default(null);
      $table
        ->integer('display_if_parent_category_id')
        ->nullable()
        ->default(null);
      $table
        ->string('language_code')
        ->nullable()
        ->default(null);
      $table->string('link_pattern', 500)->default('');

      $table->index('parent_id');
    });
  }

  /**
   * Reverse the migrations.
   *
   * @return void
   */
  public function down() {
    Schema::dropIfExists('catalog_category_tree_modules');
  }
}
