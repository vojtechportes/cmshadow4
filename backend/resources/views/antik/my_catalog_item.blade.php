@if (count($data->items))
  @foreach ($data->items as $item)
    {{ dump($item) }}
  @endforeach
@else
  <div class="no-items">There are no matching items :(</div>
@endif