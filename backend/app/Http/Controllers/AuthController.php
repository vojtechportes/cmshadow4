<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\User;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Cookie;

class AuthController extends Controller {
  public function register(Request $request) {
    $this->validate($request, [
      'email' => 'required|string|unique:users,email',
      'password' => 'required|string',
    ]);

    $password = app('hash')->make($request->input('password'), [
      'rounds' => 12,
    ]);

    $id = DB::table('users')->insertGetId([
      'email' => $request->input('email'),
      'password' => $password,
    ]);

    return response()->json(['id' => $id]);
  }

  /**
   * Get a JWT via given credentials.
   *
   * @param  Request  $request
   * @return Response
   */
  public function login(Request $request) {
    //validate incoming request
    $this->validate($request, [
      'email' => 'required|string',
      'password' => 'required|string',
    ]);

    $credentials = $request->only(['email', 'password']);

    if (!($token = Auth::setTTL(7200)->attempt($credentials))) {
      return response()->json(['message' => 'Unauthorized'], 401);
    }

    return $this->respondWithToken($token);
  }

  /**
   * Get the authenticated User.
   *
   * @return \Illuminate\Http\JsonResponse
   */
  public function current() {
    return response()->json(Auth::user());
  }

  /**
   * Log the user out (Invalidate the token).
   *
   * @return \Illuminate\Http\JsonResponse
   */
  public function logout() {
    Auth::logout();

    return response()
      ->json(['message' => 'Successfully logged out'])
      ->withCookie(
        new Cookie('AUTH_USER', '', time() - 3600, '/', null, false, false)
      );
  }

  /**
   * Refresh a token.
   *
   * @return \Illuminate\Http\JsonResponse
   */
  public function refresh() {
    return $this->respondWithToken(Auth::refresh());
  }

  /**
   * Get the token array structure.
   *
   * @param  string $token
   *
   * @return \Illuminate\Http\JsonResponse
   */
  protected function respondWithToken($token) {
    $expiration = Auth::factory()->getTTL() * 60;
    $expirationTime = time() + $expiration;

    return response()
      ->json([
        'access_token' => $token,
        'token_type' => 'bearer',
        'expires_in' => $expiration,
        'expiration_time' => $expirationTime,
      ])
      ->withCookie(
        new Cookie(
          'AUTH_USER',
          $token,
          $expirationTime,
          '/',
          null,
          false,
          false
        )
      );
  }
}
