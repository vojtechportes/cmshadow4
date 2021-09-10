<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\User;

class UsersTableSeeder extends Seeder {
  /**
   * Run the database seeds.
   *
   * @return void
   */
  public function run() {
    /**
     * Views seed
     */
    if (DB::table('users')->count() === 0) {
      User::firstOrCreate([
        'email' => 'admin@domain.com',
        'password' =>
          '$2y$12$w0Cmk33A4emr3vZ.bCyvyeOy1IcT5kpch.h.RfxyE/AnCifLpK70y',
      ]);
    }
  }
}
