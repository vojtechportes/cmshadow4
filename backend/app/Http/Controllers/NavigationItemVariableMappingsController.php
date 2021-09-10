<?php

namespace App\Http\Controllers;

use App\Navigations;
use App\NavigationItems;
use App\NavigationItemVariableMappings;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class NavigationItemVariableMappingsController extends Controller {
  /**
   * Gets paginated list of navigation item variable mappings
   *
   * @param int $navigationItemId
   * @return mixed Returns paginated list of navigation item
   *               variable mappings
   */
  public function getNavigationItemVariableMappings(int $navigationItemId) {
    $navigationItemsVariableMappings = NavigationItemVariableMappings::navigationItemVariableMappings(
      $navigationItemId
    )->paginate(NavigationItemVariableMappings::getPageSize());

    return response()->json($navigationItemsVariableMappings);
  }

  /**
   * Gets navigation item variable mapping by navigationItemVariableMappingId
   *
   * @param int $navigationItemVariableMappingId
   * @return mixed Returns variable mapping or 404 status code when navigation
   *               item variable mapping is not found
   */
  public function getNavigationItemVariableMapping(
    int $navigationItemVariableMappingId
  ) {
    $navigationItemsVariableMapping = NavigationItemVariableMappings::navigationItemVariableMapping(
      $navigationItemVariableMappingId
    );

    if (isset($navigationItemsVariableMapping)) {
      return response()->json($navigationItemsVariableMapping);
    } else {
      return response('', 404);
    }
  }

  /**
   * Creates new navigation item variable mapping
   *
   * @param int $navigationId
   * @param int $navigationItemId
   * @param Illuminate\Http\Request $request
   * @return mixed Returns id of created navigation item variable mapping
   */
  public function createNavigationItemVariableMapping(
    Request $request,
    int $navigationId,
    int $navigationItemId
  ) {
    $navigation = Navigations::navigation($navigationId);
    $navigationItem = NavigationItems::navigationItem($navigationItemId);

    $this->validate($request, [
      'variable_name' => 'required|string|max:255',
      'value' => 'required|string|max:255',
    ]);

    if (isset($navigationItem) && isset($navigation)) {
      $id = DB::table('navigation_item_variable_mappings')->insertGetId([
        'navigation_id' => $navigationId,
        'navigation_item_id' => $navigationItemId,
        'variable_name' => $request->input('variable_name'),
        'value' => $request->input('value'),
      ]);

      return response()->json(['id' => $id]);
    } else {
      return response('', 404);
    }
  }

  /**
   * Updates navigation item variable mapping
   *
   * @param Illuminate\Http\Request $request
   * @param int $navigationItemVariableMappingId
   * @return void Returns 204 or 404 when navigation item variable
   *              mapping is not found
   */
  public function updateNavigationItemVariableMapping(
    Request $request,
    int $navigationItemVariableMappingId
  ) {
    $navigationItemsVariableMapping = NavigationItemVariableMappings::navigationItemVariableMapping(
      $navigationItemVariableMappingId
    );

    if (isset($navigationItemsVariableMapping)) {
      $this->validate($request, [
        'variable_name' => 'string|max:255',
        'value' => 'string|max:255',
      ]);

      DB::table('navigation_item_variable_mappings')
        ->where('id', '=', $navigationItemVariableMappingId)
        ->update([
          'variable_name' => $request->input(
            'variable_name',
            $navigationItemsVariableMapping->variable_name
          ),
          'value' => $request->input(
            'value',
            $navigationItemsVariableMapping->value
          ),
        ]);

      return response('', 204);
    } else {
      return response('', 404);
    }
  }

  /**
   * Deletes navigation item variable mapping
   *
   * @param int $navigationItemVariableMappingId
   * @return void Returns 204 status code or 404 when
   *              navigation item variable mapping is not found
   */
  public function deleteNavigationItemVariableMapping(
    int $navigationItemVariableMappingId
  ) {
    $navigationItemsVariableMapping = NavigationItemVariableMappings::navigationItemVariableMapping(
      $navigationItemVariableMappingId
    );

    if (isset($navigationItemsVariableMapping)) {
      DB::table('navigation_item_variable_mappings')
        ->where('id', '=', $navigationItemVariableMappingId)
        ->delete();

      return response('', 204);
    } else {
      return response('', 404);
    }
  }
}
