<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateNavigationItemVariableMappingsTable extends Migration {
  /**
   * Run the migrations.
   *
   * @return void
   */
  public function up() {
    Schema::create('navigation_item_variable_mappings', function (
      Blueprint $table
    ) {
      $table->bigIncrements('id');
      $table->integer('navigation_id');
      $table->integer('navigation_item_id');
      $table->string('variable_name');
      $table->string('value');

      $table->index('variable_name');
      $table->index('navigation_id');
      $table->index('navigation_item_id');
    });
  }

  /**
   * Reverse the migrations.
   *
   * @return void
   */
  public function down() {
    Schema::dropIfExists('navigation_item_variable_mappings');
  }
}
