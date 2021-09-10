<?php

namespace App;

use App\BaseModel;
use Illuminate\Support\Facades\DB;

class LayoutSlots extends BaseModel {
  protected function layoutSlots(int $layoutId) {
    return DB::table('layout_slots')->where('layout_id', '=', $layoutId);
  }

  protected function layoutSlot(int $layoutSlotId) {
    return DB::table('layout_slots')
      ->where('id', '=', $layoutSlotId)
      ->get()
      ->first();
  }
}
