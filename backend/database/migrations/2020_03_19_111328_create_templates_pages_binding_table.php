<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTemplatesPagesBindingTable extends Migration {
  /**
   * Run the migrations.
   *
   * @return void
   */
  public function up() {
    Schema::create('templates_pages_binding', function (Blueprint $table) {
      $table->integer('template_id');
      $table->integer('template_page_id');
      $table->integer('weight')->default(50);

      $table->index('template_id');
      $table->index('template_page_id');
      $table->index('weight');
    });
  }

  /**
   * Reverse the migrations.
   *
   * @return void
   */
  public function down() {
    Schema::dropIfExists('templates_pages_binding');
  }
}
