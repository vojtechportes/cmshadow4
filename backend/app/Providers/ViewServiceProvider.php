<?php

namespace App\Providers;

use Illuminate\Support\Facades\View;
use Illuminate\Support\ServiceProvider;

class ViewServiceProvider extends ServiceProvider {
  /**
   * Register any application services.
   *
   * @return void
   */
  public function register() {
    //
  }

  /**
   * Bootstrap any application services.
   *
   * @return void
   */
  public function boot() {
    View::composer('*.text', 'App\Http\View\Composers\TextComposer');
    View::composer('*.heading', 'App\Http\View\Composers\HeadingComposer');
    View::composer('*.image', 'App\Http\View\Composers\ImageComposer');
    View::composer(
      '*.navigation',
      'App\Http\View\Composers\NavigationComposer'
    );
    View::composer(
      '*.catalog_listing',
      'App\Http\View\Composers\CatalogListingComposer'
    );
    View::composer(
      '*.catalog_detail',
      'App\Http\View\Composers\CatalogDetailComposer'
    );
    View::composer(
      '*.catalog_category_tree',
      'App\Http\View\Composers\CatalogCategoryTreeComposer'
    );
    View::composer(
      '*.catalog_search',
      'App\Http\View\Composers\CatalogSearchComposer'
    );
    View::composer('*.order_form', 'App\Http\View\Composers\OrderFormComposer');
    View::composer(
      '*.catalog_category',
      'App\Http\View\Composers\CatalogCategoryComposer'
    );
  }
}
