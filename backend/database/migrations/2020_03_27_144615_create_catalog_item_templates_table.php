<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCatalogItemTemplatesTable extends Migration {
  /**
   * Run the migrations.
   *
   * @return void
   */
  public function up() {
    Schema::create('catalog_item_templates', function (Blueprint $table) {
      $table->bigIncrements('id');
      $table->integer('view_id');
      $table->string('name', 255);
      $table->string('path', 255);

      $table->index('view_id');
      $table->index('name');
      $table->index('path');
    });
  }

  /**
   * Reverse the migrations.
   *
   * @return void
   */
  public function down() {
    Schema::dropIfExists('catalog_item_templates');
  }
}
