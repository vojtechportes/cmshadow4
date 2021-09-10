<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCatalogItemsStockTable extends Migration {
  /**
   * Run the migrations.
   *
   * @return void
   */
  public function up() {
    Schema::create('catalog_items_stock', function (Blueprint $table) {
      $table->integer('catalog_item_id');
      $table->integer('amount');
      $table->boolean('can_order_if_unavailable')->default(false);

      $table->index('catalog_item_id');
      $table->index('amount');
      $table->index('can_order_if_unavailable');
    });
  }

  /**
   * Reverse the migrations.
   *
   * @return void
   */
  public function down() {
    Schema::dropIfExists('catalog_items_stock');
  }
}
