<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateButtonModulesTable extends Migration {
  /**
   * Run the migrations.
   *
   * @return void
   */
  public function up() {
    Schema::create('button_modules', function (Blueprint $table) {
      $table->integer('parent_id');
      $table->string('text');
      $table->string('path');
      $table->enum('target', ['BLANK', 'SELF', 'PARENT', 'TOP']);
      $table->integer('button_id');

      $table->index('parent_id');
    });
  }

  /**
   * Reverse the migrations.
   *
   * @return void
   */
  public function down() {
    Schema::dropIfExists('button_modules');
  }
}
