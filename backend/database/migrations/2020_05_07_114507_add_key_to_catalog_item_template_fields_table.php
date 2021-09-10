<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddKeyToCatalogItemTemplateFieldsTable extends Migration {
  /**
   * Run the migrations.
   *
   * @return void
   */
  public function up() {
    Schema::table('catalog_item_template_fields', function (Blueprint $table) {
      $table->string('key')->after('name');
    });
  }

  /**
   * Reverse the migrations.
   *
   * @return void
   */
  public function down() {
    Schema::table('catalog_item_template_fields', function (Blueprint $table) {
      $table->dropColumn('key');
    });
  }
}
