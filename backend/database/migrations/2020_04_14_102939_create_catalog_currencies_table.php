<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCatalogCurrenciesTable extends Migration {
  /**
   * Run the migrations.
   *
   * @return void
   */
  public function up() {
    Schema::create('catalog_currencies', function (Blueprint $table) {
      $table->bigIncrements('id');
      $table->string('name');
      $table->string('code');
      $table->string('symbol')->default('');
      $table->float('rate', 8, 6);
      $table->integer('decimal_places')->default(2);
      $table->boolean('is_main')->default(false);
      $table->boolean('inherits_tax_rate')->default(true);
      $table->boolean('fetch_currency_rate')->default(false);

      $table->index('code');
      $table->index('is_main');
      $table->index('fetch_currency_rate');
    });
  }

  /**
   * Reverse the migrations.
   *
   * @return void
   */
  public function down() {
    Schema::dropIfExists('catalog_currencies');
  }
}
