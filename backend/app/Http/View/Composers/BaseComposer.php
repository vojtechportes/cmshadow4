<?php

namespace App\Http\View\Composers;

use Illuminate\Http\Request;

class BaseComposer {
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
