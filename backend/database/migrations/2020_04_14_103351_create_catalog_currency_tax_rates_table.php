<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCatalogCurrencyTaxRatesTable extends Migration {
  /**
   * Run the migrations.
   *
   * @return void
   */
  public function up() {
    Schema::create('catalog_currency_tax_rates', function (Blueprint $table) {
      $table->bigIncrements('id');
      $table->integer('currency_id');
      $table
        ->float('rate', 8, 6)
        ->nullable()
        ->default(null);
      $table->integer('weight')->default(50);

      $table->index('currency_id');
    });
  }

  /**
   * Reverse the migrations.
   *
   * @return void
   */
  public function down() {
    Schema::dropIfExists('catalog_currency_tax_rates');
  }
}
