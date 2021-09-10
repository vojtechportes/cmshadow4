<div class="catalog-listing">
  @if (count($data['data']))
    @foreach ($data['data'] as $item)
      @include(
        $global['view']['path'] . '.' .
        '.' . $item['data']['template_path'],
        ['data' => $item])
    @endforeach
  @else
    <div class="no-items">There are no matching items :(</div>
  @endif
</div>