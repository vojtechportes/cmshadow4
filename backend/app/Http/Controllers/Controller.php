<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Laravel\Lumen\Routing\Controller as BaseController;
use Illuminate\Http\Request;

class Controller extends BaseController {
  protected function respondWithToken($token) {
    return response()->json(
      [
        'token' => $token,
        'token_type' => 'bearer',
        'expires_in' => Auth::factory()->getTTL() * 60,
      ],
      200
    );
  }

  protected function isAuthorized(Request $request) {
    /**
     * Check whether current user is authorized or not
     */
    // TODO check also whether user is approved and if he has proper role

    // return Auth::check();

    // TODO just a temporary solution -vvv
    return $request->cookie('AUTH_USER');
  }
}
