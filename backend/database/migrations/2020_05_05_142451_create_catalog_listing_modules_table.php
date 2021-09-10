<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCatalogListingModulesTable extends Migration {
  /**
   * Run the migrations.
   *
   * @return void
   */
  public function up() {
    Schema::create('catalog_listing_modules', function (Blueprint $table) {
      $table->integer('parent_id');
      $table
        ->string('language_code')
        ->nullable()
        ->default(null);
      $table
        ->integer('category_id')
        ->nullable()
        ->default(null);
      $table
        ->string('category_id_variable_name')
        ->nullable()
        ->default(null);

      $table->index('parent_id');
    });
  }

  /**
   * Reverse the migrations.
   *
   * @return void
   */
  public function down() {
    Schema::dropIfExists('catalog_listing_modules');
  }
}
