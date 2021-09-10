<?php

namespace App;

use Ramsey\Uuid\Uuid;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Model;

class BaseModel extends Model {
  protected $pageSize = 20;

  protected function getPageSize() {
    return $this->pageSize;
  }

  protected function getUUID() {
    return Uuid::uuid4()->toString();
  }

  protected function getChildrenRecursive(
    int $id,
    string $tableName,
    string $parentColumnName
  ) {
    $items = [$id];

    $getItems = function (int $id) use (
      &$items,
      &$getItems,
      $tableName,
      $parentColumnName
    ) {
      $results = DB::table($tableName)
        ->where($parentColumnName, '=', $id)
        ->get();

      if ($results->count() > 0) {
        foreach ($results as $result) {
          array_push($items, $result->id);

          $getItems($result->id);
        }
      }
    };

    $getItems($id);

    return $items;
  }
}
