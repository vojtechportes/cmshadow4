<?php

namespace App\Http\View\Composers;

use Illuminate\View\View;
use Illuminate\Http\Request;
use App\Http\Controllers\OrderController;

class OrderFormComposer {
  public function compose(View $view) {
    $request = $view->getData()['global']['request'];
    $data = $request->session()->get('data');
    $values = [
      'name' => '',
      'email' => '',
      'phone' => '',
      'note' => '',
    ];

    $nameErrors = [];
    $emailErrors = [];
    $phoneErrors = [];
    $noteErrors = [];

    if ($data !== null) {
      $errors = object_to_array($data['errors']);

      if (array_key_exists('name', $errors)) {
        $nameErrors = $errors['name'];
      }

      if (array_key_exists('email', $errors)) {
        $emailErrors = $errors['email'];
      }

      if (array_key_exists('phone', $errors)) {
        $phoneErrors = $errors['phone'];
      }

      if (array_key_exists('note', $errors)) {
        $noteErrors = $errors['note'];
      }
    }

    $errors = [
      'name' => $nameErrors,
      'email' => $emailErrors,
      'phone' => $phoneErrors,
      'note' => $noteErrors,
    ];

    if ($data !== null) {
      $values = $data['values'];
    }

    $view->with('values', $values)->with('errors', $errors);
  }
}
