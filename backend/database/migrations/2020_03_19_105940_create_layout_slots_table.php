<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLayoutSlotsTable extends Migration {
  /**
   * Run the migrations.
   *
   * @return void
   */
  public function up() {
    Schema::create('layout_slots', function (Blueprint $table) {
      $table->bigIncrements('id');
      $table
        ->integer('parent_id')
        ->nullable()
        ->default(null);
      $table->integer('layout_id');
      $table->string('name', 255);
      $table->boolean('writeable')->default(true);
      $table->boolean('locked')->default(false);
      $table->integer('weight')->default(50);
      $table->string('html_class_name', 500);
      $table->string('html_id', 255);
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

      $table->index('parent_id');
      $table->index('name');
      $table->index('writeable');
      $table->index('locked');
      $table->index('weight');
    });
  }

  /**
   * Reverse the migrations.
   *
   * @return void
   */
  public function down() {
    Schema::dropIfExists('layout_slots');
  }
}
