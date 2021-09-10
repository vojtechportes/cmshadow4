<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddMetaColumnsToPagesTable extends Migration {
  /**
   * Run the migrations.
   *
   * @return void
   */
  public function up() {
    Schema::table('pages', function (Blueprint $table) {
      $table->string('meta_title')->default('');
      $table->binary('meta_description')->default('');
      $table->string('meta_keywords')->default('');
      $table
        ->enum('meta_robots', [
          'ALL',
          'NOINDEX',
          'NOINDEX_NOFOLLOW',
          'INDEX_NOFOLLOW',
          'INDEX_FOLLOW',
        ])
        ->default('INDEX_FOLLOW');
      $table
        ->string('meta_canonical')
        ->nullable()
        ->default(null);
      $table
        ->string('meta_image')
        ->nullable()
        ->default(null);
      $table->binary('html_head_end')->default('');
      $table->binary('html_body_start')->default('');
      $table->binary('html_body_end')->default('');
    });
  }

  /**
   * Reverse the migrations.
   *
   * @return void
   */
  public function down() {
    Schema::table('pages', function (Blueprint $table) {
      $table->dropColumn([
        'meta_title',
        'meta_description',
        'meta_keywords',
        'meta_robots',
        'meta_canonical',
        'meta_image',
        'html_head_end',
        'html_body_start',
        'html_body_end',
      ]);
    });
  }
}
