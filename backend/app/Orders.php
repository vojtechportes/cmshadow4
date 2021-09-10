<?php

namespace App;

use App\BaseModel;
use Illuminate\Support\Facades\DB;

class Orders extends BaseModel {
  protected function orders() {
    return DB::table('orders')->orderBy('created_at', 'desc');
  }

  protected function order(int $orderId) {
    return DB::table('orders')
      ->where('id', '=', $orderId)
      ->get()
      ->first();
  }
}
