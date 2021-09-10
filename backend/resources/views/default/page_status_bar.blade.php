@if ($global['is_authorized'])
  <div class="cms__toolbar">
    <div class="cms__toolbar_content">
      <span>Page name: <strong>{{ $global['page']['name'] }}</strong></span>
      <button class="cms__button cms__button--primary" href="/admin/content/{{ $global['page']['identifier'] }}">Edit</button>
    </div>

    @if ($global['page']['status'] !== 'PUBLISHED')
      <div class="cms__warning">
        This versios of page "{{ $global['page']['name'] }}" is in status <strong>{!! PAGE_STATUS[$global['page']['status']] !!}</strong> and won't be visible to visitors until it is published.
      </div>
    @endif  
  </div>
@endif

@if ($global['is_authorized'])
  @if ($global['page']['status'] !== 'PUBLISHED')
    <div style="height: 98px;"></div>
  @else
    <div style="height: 56px;"></div>
  @endif
@endif

@if ($global['is_authorized'])
  @if (array_key_exists("cms__debug", $global['params']))
  <div class="cms__content">
    <strong>$global.template</strong>
    @php dump($global['template']) @endphp

    <strong>$global.layout</strong>
    @php dump($global['layout']) @endphp

    <strong>$global.view</strong>
    @php dump($global['view']) @endphp

    <strong>$global.default_view_path</strong>
    @php dump($global['default_view_path']) @endphp

    <strong>$global.default_view_path</strong>
    @php dump($global['default_view_path']) @endphp

    <strong>$global.params</strong>
    @php dump($global['params']) @endphp

    <strong>$global.param_bindings</strong>
    @php dump($global['param_bindings']) @endphp

    <strong>$global.request</strong>
    @php dump($global['request']) @endphp

    <strong>$global.page</strong>
    @php dump($global['page']) @endphp

    <strong>$global.is_authorized</strong>
    @php dump($global['is_authorized']) @endphp
    </div>
  @endif
@endif

