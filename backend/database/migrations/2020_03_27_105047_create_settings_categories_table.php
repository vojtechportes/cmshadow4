<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSettingsCategoriesTable extends Migration {
  /**
   * Run the migrations.
   *
   * @return void
   */
  public function up() {
    Schema::create('settings_categories', function (Blueprint $table) {
      $table->bigIncrements('id');
      $table
        ->integer('parent_id')
        ->nullable()
        ->default(null);
      $table->string('key');
      $table->integer('weight')->default(50);

      $table->index('parent_id');
      $table->index('key');
      $table->index('weight');
    });
  }

  /**
   * Reverse the migrations.
   *
   * @return void
   */
  public function down() {
    Schema::dropIfExists('settings_categories');
  }
}
