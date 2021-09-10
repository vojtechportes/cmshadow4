<?php

namespace App;

use App\BaseModel;
use Illuminate\Support\Facades\DB;

class VariableNameActions extends BaseModel {
  /**
   *
   */
  protected function variableNameActions(
    array $variableNames = [],
    $path = null
  ) {
    $items = DB::table('variable_name_actions')->orderBy(
      'variable_name',
      'asc'
    );

    if (count($variableNames) > 0) {
      $items->whereIn('variable_name', $variableNames);
    }

    if ($path !== null) {
      $items->where('path', '=', $path);
    }

    return $items;
  }

  protected function variableNameAction(int $variableNameActionId) {
    return DB::table('variable_name_actions')
      ->where('id', '=', $variableNameActionId)
      ->get()
      ->first();
  }
}
