  @php 
    $paramBindings = $global['param_bindings'] 
  @endphp
  
  @if (array_key_exists("catalogItemId", $paramBindings))
    @php 
      $catalogItem = $paramBindings['catalogItemId'];
      $fields = $catalogItem['data']['fields'];
    @endphp

    @if ($fields !== null)
      @if (array_key_exists("name", $fields))
        <title>
          {{ $global['page']['meta_title'] }} - {{ $fields['name']['value'] }}
        </title>
      @else
        <title>{{ $global['page']['meta_title'] }}</title>
      @endif
    @else
      <title>{{ $global['page']['meta_title'] }}</title>
    @endif
  @else
    <title>{{ $global['page']['meta_title'] }}</title>
  @endif