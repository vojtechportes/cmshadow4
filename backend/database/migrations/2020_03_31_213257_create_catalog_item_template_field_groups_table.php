<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCatalogItemTemplateFieldGroupsTable extends Migration {
  /**
   * Run the migrations.
   *
   * @return void
   */
  public function up() {
    Schema::table('catalog_item_template_field_groups', function (
      Blueprint $table
    ) {
      //
    });
  }

  /**
   * Reverse the migrations.
   *
   * @return void
   */
  public function down() {
    Schema::table('catalog_item_template_field_groups', function (
      Blueprint $table
    ) {
      //
    });
  }
}
