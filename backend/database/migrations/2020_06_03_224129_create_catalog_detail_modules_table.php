<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCatalogDetailModulesTable extends Migration {
  /**
   * Run the migrations.
   *
   * @return void
   */
  public function up() {
    Schema::create('catalog_detail_modules', function (Blueprint $table) {
      $table->integer('parent_id');
      $table
        ->integer('catalog_item_id')
        ->nullable()
        ->defualt(null);
      $table
        ->string('language_code')
        ->nullable()
        ->default(null);
      $table
        ->string('catalog_item_id_variable_name')
        ->nullable()
        ->default(null);
      $table->boolean('load_from_global_context')->default(false);

      $table->index('parent_id');
    });
  }

  /**
   * Reverse the migrations.
   *
   * @return void
   */
  public function down() {
    Schema::dropIfExists('catalog_detail_modules');
  }
}
