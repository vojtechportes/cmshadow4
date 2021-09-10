@foreach ($components as $component)
  @if ($component['content_type'] === 'SLOT')
    @includeFirst([
      $global['view']['path'] . '.slot',
      $global['default_view_path'] . '.slot'
    ], $component)
  @elseif ($component['content_type'] === 'MODULE')
  {{ dump($global['view']['path']) }}
    @includeFirst([
      $global['view']['path'] . '.' . strtolower($component['module_type']),
      $global['default_view_path'] . '.' . strtolower($component['module_type']),
    ], ['component' => $component])
  @endif
@endforeach