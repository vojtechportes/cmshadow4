<?php

namespace App\Http\Controllers;

use App\VariableNameActions;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;

class VariableNameActionsController extends Controller {
  /**
   * Gets paginated list of variable name actions
   *
   * @return mixed Returns paginated list of variable name actions
   */
  public function getVariableNameActions() {
    $variableNameActions = VariableNameActions::variableNameActions()->paginate(
      VariableNameActions::getPageSize()
    );

    return response()->json($variableNameActions);
  }

  /**
   * Gets variable name action
   *
   * @param int $variableNameActionId
   * @return mixed Returns variable name action or 404 status
   *               code when variable name action is not found
   */
  public function getVariableNameAction(int $variableNameActionId) {
    $variableNameAction = VariableNameActions::variableNameAction(
      $variableNameActionId
    );

    if (isset($variableNameAction)) {
      return response()->json($variableNameAction);
    } else {
      return response('', 404);
    }
  }

  /**
   * Creates variable name action
   *
   * @param Illuminate\Http\Request $request
   */
  public function createVariableNameAction(Request $request) {
    $this->validate($request, [
      'variable_name' => [
        'required',
        /**
         * Validates whether variable_name already exists for given path
         */
        Rule::unique('variable_name_actions', 'variable_name')->where(function (
          $query
        ) use ($request) {
          $query->where('path', '=', $request->input('path'));
        }),
      ],
      'path' => 'required|string|max:500',
      'language_code' => 'string',
      'action' => [
        'required',
        Rule::in([
          'GET_CATALOG_CATEGORY',
          'GET_CATALOG_ITEM',
          'GET_PAGE_CATEGORY',
        ]),
      ],
    ]);

    $id = DB::table('variable_name_actions')->insertGetId([
      'variable_name' => $request->input('variable_name'),
      'path' => $request->input('path'),
      'language_code' => $request->input('language_code', null),
      'action' => $request->input('action'),
    ]);

    return response()->json(['id' => $id]);
  }

  /**
   * Update variable name action
   *
   * @param Illuminate\Http\Request $request
   * @param int $variableNameActionId
   **/
  public function updateVariableNameAction(
    Request $request,
    int $variableNameActionId
  ) {
    $this->validate($request, [
      'variable_name' => [
        'required',
        /**
         * Validates whether variable_name already exists for given path
         **/
        Rule::unique('variable_name_actions', 'variable_name')->where(function (
          $query
        ) use ($request, $variableNameActionId) {
          $query
            ->where('path', '=', $request->input('path'))
            ->where('id', '!=', $variableNameActionId);
        }),
      ],
      'path' => 'required|string|max:500',
      'language_code' => 'string',
      'action' => [
        'required',
        Rule::in([
          'GET_CATALOG_CATEGORY',
          'GET_CATALOG_ITEM',
          'GET_PAGE_CATEGORY',
        ]),
      ],
    ]);

    $variableNameAction = VariableNameActions::variableNameAction(
      $variableNameActionId
    );

    if (isset($variableNameAction)) {
      $languageCode = $request->input('language_code');

      DB::table('variable_name_actions')
        ->where('id', '=', $variableNameActionId)
        ->update([
          'variable_name' => $request->input(
            'variable_name',
            $variableNameAction->variable_name
          ),
          'path' => $request->input('path', $variableNameAction->path),
          'language_code' =>
            $languageCode === ''
              ? null
              : $request->input(
                'language_code',
                $variableNameAction->language_code
              ),
          'action' => $request->input('action'),
        ]);

      return response('', 204);
    } else {
      return response('', 404);
    }
  }

  /**
   * Delete variable name action
   *
   * @param int $variableNameActionId
   **/
  public function deleteVariableNameAction(int $variableNameActionId) {
    $variableNameAction = VariableNameActions::variableNameAction(
      $variableNameActionId
    );

    if (isset($variableNameAction)) {
      DB::table('variable_name_actions')
        ->where('id', '=', $variableNameActionId)
        ->delete();

      return response('', 204);
    } else {
      return response('', 404);
    }
  }
}
