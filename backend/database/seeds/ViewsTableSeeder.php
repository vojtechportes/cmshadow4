<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Views;

class ViewsTableSeeder extends Seeder {
  /**
   * Run the database seeds.
   *
   * @return void
   */
  public function run() {
    /**
     * Views seed
     */
    if (DB::table('views')->count() === 0) {
      Views::firstOrCreate(['name' => 'Default', 'path' => 'default']);
    }
  }
}
