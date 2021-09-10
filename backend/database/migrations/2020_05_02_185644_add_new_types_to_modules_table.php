<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddNewTypesToModulesTable extends Migration {
  /**
   * Run the migrations.
   *
   * @return void
   */
  public function up() {
    /**
     * Statement used instead of query builder since changing of enum type
     * is not yet supported
     */
    DB::statement("ALTER TABLE modules CHANGE module_type module_type ENUM(
      'TEXT',
      'GALLERY',
      'IMAGE',
      'HEADING',
      'NAVIGATION',
      'LOGO',
      'CATALOG_CATEGORY_TREE',
      'CATALOG_CATEGORY',
      'CATALOG_LISTING',
      'CATALOG_SEARCH',
      'CATALOG_ITEM',
      'CATALOG_DETAIL',
      'CAROUSEL',
      'FORM',
      'HTML',
      'BUTTON',
      'GRID',
      'PRICE',
      'PAGE_LISTING',
      'PAGE_TAG_TREE',
      'PAGE_SEARCH')");
  }

  /**
   * Reverse the migrations.
   *
   * @return void
   */
  public function down() {
    /**
     * Statement used instead of query builder since changing of enum type
     * is not yet supported
     */
    DB::statement("ALTER TABLE modules CHANGE module_type module_type ENUM(
      'TEXT',
      'GALLERY',
      'IMAGE',
      'HEADING',
      'NAVIGATION',
      'LOGO',
      'CATALOG_CATEGORY_TREE',
      'CATALOG_LISTING',
      'CATALOG_DETAIL',
      'FORM',
      'HTML')");
  }
}
