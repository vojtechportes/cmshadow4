<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCatalogLanguagesTable extends Migration {
  /**
   * Run the migrations.
   *
   * @return void
   */
  public function up() {
    Schema::create('catalog_languages', function (Blueprint $table) {
      $table->string('name');
      $table->string('code');
      $table
        ->integer('default_currency_id')
        ->nullable()
        ->default(null);
      $table
        ->integer('default_tax_rate_id')
        ->nullable()
        ->default(null);

      $table->index('name');
      $table->index('code');
    });
  }

  /**
   * Reverse the migrations.
   *
   * @return void
   */
  public function down() {
    Schema::dropIfExists('catalog_languages');
  }
}
