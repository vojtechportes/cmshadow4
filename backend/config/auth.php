<?php

return [
  "defaults" => [
    "guard" => env('AUTH_GUARD', "api/v1"),
    "passwords" => "users",
  ],

  "guards" => [
    "api/v1" => [
      "driver" => "jwt",
      "provider" => "users",
    ],
  ],

  "providers" => [
    "users" => [
      "driver" => "eloquent",
      "model" => \App\User::class,
    ],
  ],
];
