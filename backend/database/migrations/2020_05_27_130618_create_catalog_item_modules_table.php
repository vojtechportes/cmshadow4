<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCatalogItemModulesTable extends Migration {
  /**
   * Run the migrations.
   *
   * @return void
   */
  public function up() {
    Schema::create('catalog_item_modules', function (Blueprint $table) {
      $table->integer('parent_id');
      $table->integer('catalog_item_id');
      $table
        ->string('language_code')
        ->nullable()
        ->default(null);

      // TODO: check whether language_code is migrated properly (nullable and
      //       default value)

      $table->index('parent_id');
    });
  }

  /**
   * Reverse the migrations.
   *
   * @return void
   */
  public function down() {
    Schema::dropIfExists('catalog_item_modules');
  }
}
