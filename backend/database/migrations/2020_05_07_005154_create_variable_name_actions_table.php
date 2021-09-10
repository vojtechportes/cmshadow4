<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateVariableNameActionsTable extends Migration {
  /**
   * Run the migrations.
   *
   * @return void
   */
  public function up() {
    Schema::create('variable_name_actions', function (Blueprint $table) {
      $table->bigIncrements('id');
      $table->string('variable_name');
      $table->string('path', 500);
      $table
        ->string('language_code')
        ->nullable()
        ->default(null);
      $table->enum('action', [
        'GET_CATALOG_CATEGORY',
        'GET_CATALOG_ITEM',
        'GET_PAGE_TAG',
      ]);

      $table->index('variable_name');
      $table->index('path');
    });
  }

  /**
   * Reverse the migrations.
   *
   * @return void
   */
  public function down() {
    Schema::dropIfExists('variable_name_actions');
  }
}
