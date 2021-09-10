<div class="slot slot-id-{{ $id }} {{ $html_class_name }}" id="{{ $html_id }}">
    @if (isset($component['children']))
      @includeFirst(['renderer'], ['components' => $component['children']])
    @endif
</div>