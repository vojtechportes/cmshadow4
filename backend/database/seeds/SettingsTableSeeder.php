<?php

use Illuminate\Database\Seeder;
use App\SettingsCategories;
use App\Settings;

class SettingsTableSeeder extends Seeder {
  /**
   * Run the database seeds.
   *
   * @return void
   */
  public function run() {
    /**
     * Settings catalog category seed
     */

    $catalogCategory = SettingsCategories::where('key', 'CATALOG')->first();

    if ($catalogCategory !== null && $catalogCategory->id) {
      if (
        Settings::where('key', 'SETTINGS_CATALOG_SKU_FIELD')->first() === null
      ) {
        Settings::firstOrCreate([
          'category_id' => $catalogCategory->id,
          'key' => 'SETTINGS_CATALOG_SKU_FIELD',
          'value_type' => 'STRING',
          'value' => 'sku',
        ]);
      }

      if (
        Settings::where('key', 'SETTINGS_CATALOG_NAME_FIELD')->first() === null
      ) {
        Settings::firstOrCreate([
          'category_id' => $catalogCategory->id,
          'key' => 'SETTINGS_CATALOG_NAME_FIELD',
          'value_type' => 'STRING',
          'value' => 'name',
        ]);
      }

      if (
        Settings::where(
          'key',
          'SETTINGS_CATALOG_DESCRIPTION_FIELD'
        )->first() === null
      ) {
        Settings::firstOrCreate([
          'category_id' => $catalogCategory->id,
          'key' => 'SETTINGS_CATALOG_DESCRIPTION_FIELD',
          'value_type' => 'STRING',
          'value' => 'description',
        ]);
      }

      if (
        Settings::where('key', 'SETTINGS_CATALOG_IMAGE_FIELD')->first() === null
      ) {
        Settings::firstOrCreate([
          'category_id' => $catalogCategory->id,
          'key' => 'SETTINGS_CATALOG_IMAGE_FIELD',
          'value_type' => 'STRING',
          'value' => 'image',
        ]);
      }

      if (
        Settings::where('key', 'SETTINGS_CATALOG_IMAGE_QUALITY')->first() ===
        null
      ) {
        Settings::firstOrCreate([
          'category_id' => $catalogCategory->id,
          'key' => 'SETTINGS_CATALOG_IMAGE_QUALITY',
          'value_type' => 'INTEGER',
          'value' => '95',
        ]);
      }

      if (
        Settings::where('key', 'SETTINGS_CATALOG_IMAGE_WIDTH')->first() === null
      ) {
        Settings::firstOrCreate([
          'category_id' => $catalogCategory->id,
          'key' => 'SETTINGS_CATALOG_IMAGE_WIDTH',
          'value_type' => 'INTEGER',
          'value' => '1500',
        ]);
      }

      if (
        Settings::where('key', 'SETTINGS_CATALOG_IMAGE_HEIGHT')->first() ===
        null
      ) {
        Settings::firstOrCreate([
          'category_id' => $catalogCategory->id,
          'key' => 'SETTINGS_CATALOG_IMAGE_HEIGHT',
          'value_type' => 'INTEGER',
          'value' => '1500',
        ]);
      }

      if (
        Settings::where('key', 'SETTINGS_CATALOG_TH_IMAGE_QUALITY')->first() ===
        null
      ) {
        Settings::firstOrCreate([
          'category_id' => $catalogCategory->id,
          'key' => 'SETTINGS_CATALOG_TH_IMAGE_QUALITY',
          'value_type' => 'INTEGER',
          'value' => '95',
        ]);
      }

      if (
        Settings::where('key', 'SETTINGS_CATALOG_TH_IMAGE_WIDTH')->first() ===
        null
      ) {
        Settings::firstOrCreate([
          'category_id' => $catalogCategory->id,
          'key' => 'SETTINGS_CATALOG_TH_IMAGE_WIDTH',
          'value_type' => 'INTEGER',
          'value' => '500',
        ]);
      }

      if (
        Settings::where('key', 'SETTINGS_CATALOG_TH_IMAGE_HEIGHT')->first() ===
        null
      ) {
        Settings::firstOrCreate([
          'category_id' => $catalogCategory->id,
          'key' => 'SETTINGS_CATALOG_TH_IMAGE_HEIGHT',
          'value_type' => 'INTEGER',
          'value' => '500',
        ]);
      }
    }

    /**
     * Settings catalog category seed
     */

    $pages = SettingsCategories::where('key', 'PAGES')->first();

    if ($pages !== null && $pages->id) {
      if (
        Settings::where('key', 'SETTINGS_PAGE_META_IMAGE_WIDTH')->first() ===
        null
      ) {
        Settings::firstOrCreate([
          'category_id' => $pages->id,
          'key' => 'SETTINGS_PAGE_META_IMAGE_WIDTH',
          'value_type' => 'INTEGER',
          'value' => '1200',
        ]);
      }

      if (
        Settings::where('key', 'SETTINGS_PAGE_META_IMAGE_HEIGHT')->first() ===
        null
      ) {
        Settings::firstOrCreate([
          'category_id' => $pages->id,
          'key' => 'SETTINGS_PAGE_META_IMAGE_HEIGHT',
          'value_type' => 'INTEGER',
          'value' => '630',
        ]);
      }

      if (
        Settings::where('key', 'SETTINGS_PAGE_META_IMAGE_QUALITY')->first() ===
        null
      ) {
        Settings::firstOrCreate([
          'category_id' => $pages->id,
          'key' => 'SETTINGS_PAGE_META_IMAGE_QUALITY',
          'value_type' => 'INTEGER',
          'value' => '95',
        ]);
      }
    }
  }
}
