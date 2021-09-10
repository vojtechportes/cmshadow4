<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOrdersTable extends Migration {
  /**
   * Run the migrations.
   *
   * @return void
   */
  public function up() {
    Schema::create('orders', function (Blueprint $table) {
      $table->bigIncrements('id');
      $table->binary('customer');
      $table->binary('catalog_item');
      $table->timestamp('created_at', 0)->useCurrent();
      $table
        ->timestamp('modified_at', 0)
        ->nullable()
        ->default(null);
      $table
        ->enum('status', ['NEW', 'ACCEPTED', 'REJECTED', 'CLOSED'])
        ->default('NEW');
      $table->binary('private_note');

      $table->index('status');
    });
  }

  /**
   * Reverse the migrations.
   *
   * @return void
   */
  public function down() {
    Schema::dropIfExists('orders');
  }
}
