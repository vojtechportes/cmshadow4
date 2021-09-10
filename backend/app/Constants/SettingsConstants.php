<?php

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

if (!function_exists('getSettingsConstants')) {
  /**
   * @return void
   */
  function getSettingsConstants() {
    if (Schema::hasTable('settings')) {
      $settings = DB::table('settings')
        ->orderBy('weight', 'asc')
        ->get();

      foreach ($settings as $setting) {
        $value;

        switch ($setting->value_type) {
          case 'INTEGER':
            $value = (int) $setting->value;
            break;
          case 'BOOLEAN':
            if ((int) $setting->value === 1) {
              $value = true;
            } else {
              $value = false;
            }
            break;
          case 'OBJECT':
            try {
              $value = json_decode($setting->value);
            } catch (Error $error) {
              $value = new Object();
            }
            break;
          case 'STRING':
          default:
            $value = (string) $setting->value;
            break;
        }

        define($setting->key, $value);
      }
    }
  }
}
