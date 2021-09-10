<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateNavigationItemsTable extends Migration {
  /**
   * Run the migrations.
   *
   * @return void
   */
  public function up() {
    Schema::create('navigation_items', function (Blueprint $table) {
      $table->bigIncrements('id');
      $table->integer('navigation_id');
      $table
        ->integer('parent_id')
        ->nullable()
        ->default(null);
      $table->string('title');
      $table
        ->string('page_identifier')
        ->nullable()
        ->default(null);
      $table
        ->string('path')
        ->nullable()
        ->default(null);
      $table->enum('target', ['BLANK', 'SELF', 'PARENT', 'TOP']);
      $table
        ->string('html_class_name')
        ->nullable()
        ->default(null);
      $table
        ->string('html_id')
        ->nullable()
        ->default(null);
      $table->integer('weight')->default(50);

      $table->index('navigation_id');
      $table->index('parent_id');
      $table->index('page_identifier');
    });
  }

  /**
   * Reverse the migrations.
   *
   * @return void
   */
  public function down() {
    Schema::dropIfExists('navigation_items');
  }
}
