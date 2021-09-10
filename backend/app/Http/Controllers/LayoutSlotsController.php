<?php

namespace App\Http\Controllers;

use App\LayoutSlots;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class LayoutSlotsController extends Controller {
  private function buildTree(
    array &$elements,
    $parentId = 0,
    $keys = ['parent' => 'parent_id', 'id' => 'id']
  ) {
    $branch = [];

    foreach ($elements as &$element) {
      if ($element[$keys['parent']] == $parentId) {
        $children = $this->buildTree($elements, $element['id'], $keys);

        if ($children) {
          $element['children'] = $children;
        }

        array_push($branch, $element);

        unset($element);
      }
    }

    usort($branch, function ($a, $b) {
      return $a['weight'] <=> $b['weight'];
    });

    return $branch;
  }

  /**
   * Gets all layout slots by layoutId organized in tree
   *
   * @param Illuminate\Http\Request $request
   * @return mixed Return all layout slots
   */
  public function getLayoutSlots(Request $request) {
    $this->validate($request, [
      'layout_id' => 'required|exists:layouts,id',
    ]);

    $layoutId = $request->input('layout_id');

    $items = [];
    $layoutSlots = LayoutSlots::layoutSlots($layoutId)->get();

    foreach ($layoutSlots as $category) {
      array_push($items, get_object_vars($category));
    }

    $rootItems = array_filter($items, function ($item) {
      return $item['parent_id'] === null;
    });

    foreach ($rootItems as &$item) {
      $tree = $this->buildTree($items, $item['id']);

      if (count($tree) > 0) {
        $item['children'] = $tree;
      }
    }

    return response()->json(array_values($rootItems));
  }

  /**
   * Gets all layout slots by layoutId
   *
   * @param Illuminate\Http\Request $request
   * @return mixed Return all layout slots
   */

  public function getAllLayoutSlots(Request $request) {
    $this->validate($request, [
      'layout_id' => 'required|exists:layouts,id',
    ]);

    $layoutId = $request->input('layout_id');
    $layoutSlots = LayoutSlots::layoutSlots($layoutId)
      ->orderBy('parent_id', 'ASC')
      ->orderBy('weight', 'ASC')
      ->get();

    return response()->json($layoutSlots);
  }

  /**
   * Gets layout slot by layoutSlotId
   *
   * @param int $layoutSlotId
   * @return mixed Return layout slot or 404 status code
   */
  public function getLayoutSlot(int $layoutSlotId) {
    $layoutSlot = LayoutSlots::layoutSlot($layoutSlotId);

    if (isset($layoutSlot)) {
      return response()->json($layoutSlot);
    } else {
      return response('', 404);
    }
  }

  /**
   * Creates new layout slot
   *
   * @param Illuminate\Http\Request $request
   * @return mixed Returns id of created layout
   */
  public function createLayoutSlot(Request $request) {
    $this->validate($request, [
      'parent_id' => 'numeric|exists:layout_slots,id',
      'layout_id' => 'required|numeric|exists:layouts,id',
      'name' => 'required|max:255',
      'writeable' => 'boolean',
      'locked' => 'boolean',
      'weight' => 'numeric',
      'html_class_name' => 'max:500',
      'html_id' => 'max:255',
    ]);

    $id = DB::table('layout_slots')->insertGetId([
      'parent_id' => $request->input('parent_id', null),
      'layout_id' => $request->input('layout_id'),
      'name' => $request->input('name'),
      'writeable' => $request->input('writeable', true),
      'locked' => $request->input('locked', false),
      'weight' => $request->input('weight', 50),
      'html_class_name' => $request->input('html_class_name', ''),
      'html_id' => $request->input('html_id', ''),
    ]);

    return response()->json(['id' => $id]);
  }

  /**
   * Updates layout slot
   *
   * @param Illuminate\Http\Request $request
   * @param int $layoutSlotId
   * @return void Returns 204 or 404 when layout slot is not found
   */
  public function updateLayoutSlot(Request $request, int $layoutSlotId) {
    $layoutSlot = LayoutSlots::layoutSlot($layoutSlotId);

    if (isset($layoutSlot)) {
      $this->validate($request, [
        'parent_id' => 'numeric|exists:layout_slots,id',
        'layout_id' => 'required|numeric|exists:layouts,id',
        'name' => 'required|max:255',
        'writeable' => 'boolean',
        'locked' => 'boolean',
        'weight' => 'numeric',
        'html_class_name' => 'max:500',
        'html_id' => 'max:255',
      ]);

      DB::table('layout_slots')
        ->where('id', '=', $layoutSlotId)
        ->update([
          'parent_id' => $request->input('parent_id', $layoutSlot->parent_id),
          'layout_id' => $request->input('layout_id', $layoutSlot->layout_id),
          'name' => $request->input('name', $layoutSlot->name),
          'writeable' => $request->input('writeable', $layoutSlot->writeable),
          'locked' => $request->input('locked', $layoutSlot->locked),
          'weight' => $request->input('weight', $layoutSlot->weight),
          'html_class_name' => $request->input(
            'html_class_name',
            $layoutSlot->html_class_name
          ),
          'html_id' => $request->input('html_id', $layoutSlot->html_id),
          'modified_at' => date('Y-m-d H:i:s'),
        ]);

      return response('', 204);
    } else {
      return response('', 404);
    }
  }

  /**
   * Deletes layout slot and all its children
   *
   * @param int $layoutSlotId
   * @return void Returns 204 or 404 when layout slot is not found
   */
  public function deleteLayoutSlot(int $layoutSlotId) {
    $layoutSlot = LayoutSlots::layoutSlot($layoutSlotId);

    if ($layoutSlot) {
      $layoutSlotIds = LayoutSlots::getChildrenRecursive(
        $layoutSlot->id,
        'layout_slots',
        'parent_id'
      );

      DB::table('layout_slots')
        ->whereIn('id', $layoutSlotIds)
        ->delete();

      return response('', 204);
    } else {
      return response('', 404);
    }
  }
}
