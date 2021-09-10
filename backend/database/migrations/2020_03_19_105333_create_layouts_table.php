<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLayoutsTable extends Migration {
  /**
   * Run the migrations.
   *
   * @return void
   */
  public function up() {
    Schema::create('layouts', function (Blueprint $table) {
      $table->bigIncrements('id');
      $table->string('name');
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

      $table->index('name');
    });
  }

  /**
   * Reverse the migrations.
   *
   * @return void
   */
  public function down() {
    Schema::dropIfExists('layouts');
  }
}
