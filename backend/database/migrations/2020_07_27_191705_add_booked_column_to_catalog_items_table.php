<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddBookedColumnToCatalogItemsTable extends Migration {
  /**
   * Run the migrations.
   *
   * @return void
   */
  public function up() {
    Schema::table('catalog_items', function (Blueprint $table) {
      $table->boolean('booked')->default(false);
    });
  }

  /**
   * Reverse the migrations.
   *
   * @return void
   */
  public function down() {
    Schema::table('catalog_items', function (Blueprint $table) {
      $table->dropColumn(['booked']);
    });
  }
}
