<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOrderHistoryTable extends Migration {
  /**
   * Run the migrations.
   *
   * @return void
   */
  public function up() {
    Schema::create('order_history', function (Blueprint $table) {
      $table->bigIncrements('id');
      $table->integer('order_id');
      $table->enum('from_status', ['NEW', 'ACCEPTED', 'REJECTED', 'CLOSED']);
      $table->enum('to_status', ['NEW', 'ACCEPTED', 'REJECTED', 'CLOSED']);
      $table->binary('original_private_note');
      $table->binary('new_private_note');
      $table->timestamp('created_at', 0)->useCurrent();
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
