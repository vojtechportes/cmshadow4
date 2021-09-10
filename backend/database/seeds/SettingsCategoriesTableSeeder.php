<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\SettingsCategories;

class SettingsCategoriesTableSeeder extends Seeder {
  /**
   * Run the database seeds.
   *
   * @return void
   */
  public function run() {
    /**
     * Settings category seed
     */

    SettingsCategories::firstOrCreate([
      'key' => 'CATALOG',
      'weight' => 20,
    ]);

    /**
     * Pages category seed
     */

    SettingsCategories::firstOrCreate([
      'key' => 'PAGES',
      'weight' => 10,
    ]);
  }
}
