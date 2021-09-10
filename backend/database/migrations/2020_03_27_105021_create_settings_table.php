<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSettingsTable extends Migration {
  /**
   * Run the migrations.
   *
   * @return void
   */
  public function up() {
    Schema::create('settings', function (Blueprint $table) {
      $table->bigIncrements('id');
      $table
        ->integer('category_id')
        ->nullable()
        ->default(null);
      $table->string('key');
      $table
        ->string('options')
        ->nullabel()
        ->default(null);
      $table
        ->enum('value_type', [
          'STRING',
          'INTEGER',
          'BOOLEAN',
          'OBJECT',
          'LIST',
          'MULTILIST',
        ])
        ->default('STRING');
      $table
        ->string('value')
        ->nullable()
        ->default(null);
      $table->integer('weight')->default(50);

      $table->index('category_id');
      $table->index('key');
      $table->index('value_type');
      $table->index('weight');
    });
  }

  /**
   * Reverse the migrations.
   *
   * @return void
   */
  public function down() {
    Schema::dropIfExists('settings');
  }
}
