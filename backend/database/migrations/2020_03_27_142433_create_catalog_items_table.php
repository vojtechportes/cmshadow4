<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCatalogItemsTable extends Migration {
  /**
   * Run the migrations.
   *
   * @return void
   */
  public function up() {
    Schema::create('catalog_items', function (Blueprint $table) {
      $table->bigIncrements('id');
      $table->integer('template_id');
      $table->timestamp('created_at', 0)->useCurrent();
      $table
        ->timestamp('modified_at', 0)
        ->nullable()
        ->default(null);
      $table->integer('created_by');
      $table
        ->integer('modified_by')
        ->nullable()
        ->default(null);
      $table->boolean('published', false);
      $table
        ->timestamp('published_at', 0)
        ->nullable()
        ->default(null);

      $table->index('template_id');
      $table->index('published');
    });
  }

  /**
   * Reverse the migrations.
   *
   * @return void
   */
  public function down() {
    Schema::dropIfExists('catalog_items');
  }
}
