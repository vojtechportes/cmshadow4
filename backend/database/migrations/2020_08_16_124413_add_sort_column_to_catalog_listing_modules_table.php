<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddSortColumnToCatalogListingModulesTable extends Migration {
  /**
   * Run the migrations.
   *
   * @return void
   */
  public function up() {
    Schema::table('catalog_listing_modules', function (Blueprint $table) {
      $table
        ->strong('sort', 1000)
        ->nullable()
        ->default(null);
    });
  }

  /**
   * Reverse the migrations.
   *
   * @return void
   */
  public function down() {
    Schema::table('catalog_listing_modules', function (Blueprint $table) {
      $table->dropColumn(['sort']);
    });
  }
}
