<?php

if (!function_exists('array_diff_assoc_recursive')) {
  function array_diff_assoc_recursive($array1, $array2) {
    foreach ($array1 as $key => $value) {
      if (is_array($value)) {
        if (!isset($array2[$key])) {
          $difference[$key] = $value;
        } elseif (!is_array($array2[$key])) {
          $difference[$key] = $value;
        } else {
          $new_diff = array_diff_assoc_recursive($value, $array2[$key]);
          if ($new_diff != false) {
            $difference[$key] = $new_diff;
          }
        }
      } elseif (!isset($array2[$key]) || $array2[$key] != $value) {
        $difference[$key] = $value;
      }
    }
    return !isset($difference) ? [] : $difference;
  }
}

if (!function_exists('object_to_array')) {
  function object_to_array($obj) {
    /**
     * Figure out if this is really the best way how to convert
     * nested object into an array
     */
    return json_decode(json_encode($obj), true);
  }
}
