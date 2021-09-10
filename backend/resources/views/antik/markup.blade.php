<!DOCTYPE html>
<html lang="en">
  <meta charset="utf-8">

  @includeFirst([
    $global['view']['path'] . '.html_title',
    $global['default_view_path'] . '.html_title'
  ])

  {!!  $global['template']['html_head_end'] !!}
  {!!  $global['page']['html_head_end'] !!}
  <link rel="stylesheet" type="text/css" href="{{ asset("storage/themes/" . $global['view']['path'] ."/main.css") }}" />
  
  @if ($global['is_authorized'])
    <link rel="stylesheet" type="text/css" href="{{ asset("storage/themes/default/admin.css") }}" />
  @endif
</html>
<body>
  @includeFirst([
    $global['view']['path'] . '.page_status_bar',
    $global['default_view_path'] . '.page_status_bar'
  ])

  {!! $global['template']['html_body_start'] !!}
  {!! $global['page']['html_body_start'] !!}

  {{-- render content --}}
  @component('renderer', ['components' => $components])
  @endcomponent
  {{-- /render content --}}
  
  {!! $global['template']['html_body_end'] !!}
  {!! $global['page']['html_body_end'] !!}
</body>