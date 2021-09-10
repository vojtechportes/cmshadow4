<?php

use Illuminate\Support\Facades\Artisan;

/**
 * Load settings constants
 */

getSettingsConstants();

$router->group(['prefix' => '__install'], function () use ($router) {
  $router->get('/migrate', function () {
    Artisan::call('migrate');
  });

  $router->get('/seed', function () {
    Artisan::call('db:seed');
  });
});

/**
 * API routes
 */

$router->group(['prefix' => 'api/v1'], function () use ($router) {
  $router->post('/login', [
    'uses' => 'AuthController@login',
  ]);

  $router->group(['middleware' => 'auth'], function () use ($router) {
    $router->get('/logout', [
      'uses' => 'AuthController@logout',
    ]);

    $router->get('/refresh-token', [
      'uses' => 'AuthController@refresh',
    ]);

    $router->post('/register', [
      'uses' => 'AuthController@register',
    ]);

    /**
     * Template Preview routes
     */
    $router->get('/template-preview', [
      'uses' => 'TemplatePreviewController@getTemplatePreview',
    ]);

    /**
     * Page routes
     */
    $router->group(['prefix' => 'pages'], function () use ($router) {
      $router->get('/', [
        'uses' => 'PagesController@getPagesCurrentVersion',
      ]);

      $router->get('/all', [
        'uses' => 'PagesController@getAllPagesCurrentVersion',
      ]);

      $router->get('/published', [
        'uses' => 'PagesController@getPublishedPages',
      ]);

      $router->get('/{identifier}', [
        'uses' => 'PagesController@getPage',
      ]);

      $router->get('/{identifier}/versions', [
        'uses' => 'PagesController@getPageVersions',
      ]);

      $router->put('/{identifier}/modules', [
        'uses' => 'PagesController@setPageModules',
      ]);

      $router->post('/', [
        'uses' => 'PagesController@createPage',
      ]);

      $router->put('/{identifier}', [
        'uses' => 'PagesController@updatePage',
      ]);

      $router->put('/{identifier}/publish', [
        'uses' => 'PagesController@publishPage',
      ]);

      $router->put('/{identifier}/unpublish', [
        'uses' => 'PagesController@unpublishPage',
      ]);

      $router->delete('/{identifier}/delete', [
        'uses' => 'PagesController@deletePage',
      ]);

      $router->post('/{identifier}/revert/{version}', [
        'uses' => 'PagesController@revertToVersion',
      ]);
    });

    /**
     * Layout routes
     */
    $router->group(['prefix' => 'layouts'], function () use ($router) {
      $router->get('/', [
        'uses' => 'LayoutsController@getLayouts',
      ]);

      $router->get('/all', [
        'uses' => 'LayoutsController@getAllLayouts',
      ]);

      $router->get('/{layoutId}', [
        'uses' => 'LayoutsController@getLayout',
      ]);

      $router->post('/', [
        'uses' => 'LayoutsController@createLayout',
      ]);

      $router->put('/{layoutId}', [
        'uses' => 'LayoutsController@updateLayout',
      ]);

      $router->delete('/{layoutId}', [
        'uses' => 'LayoutsController@deleteLayout',
      ]);
    });

    /**
     * Layout slot routes
     */
    $router->group(['prefix' => 'layout-slots'], function () use ($router) {
      $router->get('/', [
        'uses' => 'LayoutSlotsController@getLayoutSlots',
      ]);

      $router->get('/all', [
        'uses' => 'LayoutSlotsController@getAllLayoutSlots',
      ]);

      $router->get('/{layoutSlotId}', [
        'uses' => 'LayoutSlotsController@getLayoutSlot',
      ]);

      $router->post('/', [
        'uses' => 'LayoutSlotsController@createLayoutSlot',
      ]);

      $router->put('/{layoutSlotId}', [
        'uses' => 'LayoutSlotsController@updateLayoutSlot',
      ]);

      $router->delete('/{layoutSlotId}', [
        'uses' => 'LayoutSlotsController@deleteLayoutSlot',
      ]);
    });

    /**
     * Template routes
     */
    $router->group(['prefix' => 'templates'], function () use ($router) {
      $router->get('/', [
        'uses' => 'TemplatesController@getTemplates',
      ]);

      $router->get('/all', [
        'uses' => 'TemplatesController@getAllTemplates',
      ]);

      $router->post('/', [
        'uses' => 'TemplatesController@createTemplate',
      ]);

      $router->put('/{templateId}', [
        'uses' => 'TemplatesController@updateTemplate',
      ]);

      $router->delete('/{templateId}', [
        'uses' => 'TemplatesController@deleteTemplate',
      ]);

      $router->get('/{templateId}', [
        'uses' => 'TemplatesController@getTemplate',
      ]);
    });

    /**
     * Template page routes
     */
    $router->group(['prefix' => 'template-pages'], function () use ($router) {
      $router->get('/', [
        'uses' => 'TemplatePagesController@getTemplatePages',
      ]);

      $router->get('/all', [
        'uses' => 'TemplatePagesController@getAllTemplatePages',
      ]);

      $router->get('/{templatePageId}', [
        'uses' => 'TemplatePagesController@getTemplatePage',
      ]);

      $router->post('/', [
        'uses' => 'TemplatePagesController@createTemplatePage',
      ]);

      $router->put('/{templatePageId}', [
        'uses' => 'TemplatePagesController@updateTemplatePage',
      ]);

      $router->delete('/{templatePageId}', [
        'uses' => 'TemplatePagesController@deleteTemplatePage',
      ]);
    });

    /**
     * Button routes
     */
    $router->group(['prefix' => 'buttons'], function () use ($router) {
      $router->get('/', [
        'uses' => 'ButtonsController@getButtons',
      ]);

      $router->get('/all', [
        'uses' => 'ButtonsController@getAllButtons',
      ]);

      $router->get('/{buttonId}', [
        'uses' => 'ButtonsController@getButton',
      ]);

      $router->post('/', [
        'uses' => 'ButtonsController@createButton',
      ]);

      $router->put('/{buttonId}', [
        'uses' => 'ButtonsController@updateButton',
      ]);

      $router->delete('/{buttonId}', [
        'uses' => 'ButtonsController@deleteButton',
      ]);
    });

    /**
     * Navigation routes
     */
    $router->group(['prefix' => 'navigations'], function () use ($router) {
      $router->get('/', [
        'uses' => 'NavigationsController@getNavigations',
      ]);

      $router->get('/all', [
        'uses' => 'NavigationsController@getAllNavigations',
      ]);

      $router->get('/{navigationId}', [
        'uses' => 'NavigationsController@getNavigation',
      ]);

      $router->post('/', [
        'uses' => 'NavigationsController@createNavigation',
      ]);

      $router->put('/{navigationId}', [
        'uses' => 'NavigationsController@updateNavigation',
      ]);

      $router->delete('/{navigationId}', [
        'uses' => 'NavigationsController@deleteNavigation',
      ]);

      /**
       * Navigation items routes
       */
      $router->group(['prefix' => '/{navigationId}/items'], function () use (
        $router
      ) {
        $router->get('/{navigationItemId}', [
          'uses' => 'NavigationItemsController@getNavigationItem',
        ]);

        $router->post('/', [
          'uses' => 'NavigationItemsController@createNavigationItem',
        ]);

        $router->put('/{navigationItemId}', [
          'uses' => 'NavigationItemsController@updateNavigationItem',
        ]);

        $router->delete('/{navigationItemId}', [
          'uses' => 'NavigationItemsController@deleteNavigationItem',
        ]);

        /**
         * Navigation items variable mapping routes
         */
        $router->group(
          ['prefix' => '/{navigationItemId}/mappings'],
          function () use ($router) {
            $router->get('/', [
              'uses' =>
                'NavigationItemVariableMappingsController@getNavigationItemVariableMappings',
            ]);

            $router->post('/', [
              'uses' =>
                'NavigationItemVariableMappingsController@createNavigationItemVariableMapping',
            ]);

            $router->get('/{navigationItemVariableMappingId}', [
              'uses' =>
                'NavigationItemVariableMappingsController@getNavigationItemVariableMapping',
            ]);

            $router->put('/{navigationItemVariableMappingId}', [
              'uses' =>
                'NavigationItemVariableMappingsController@updateNavigationItemVariableMapping',
            ]);

            $router->delete('/{navigationItemVariableMappingId}', [
              'uses' =>
                'NavigationItemVariableMappingsController@deleteNavigationItemVariableMapping',
            ]);
          }
        );
      });
    });

    /**
     * Module routes
     */
    $router->group(['prefix' => 'modules'], function () use ($router) {
      $router->get('/', [
        'uses' => 'ModulesController@getModules',
      ]);

      $router->get('/{moduleId}', [
        'uses' => 'ModulesController@getModule',
      ]);

      $router->post('/', [
        'uses' => 'ModulesController@createModule',
      ]);

      $router->post('/{moduleId}', [
        'uses' => 'ModulesController@cloneModule',
      ]);

      $router->put('/{moduleId}', [
        'uses' => 'ModulesController@updateModule',
      ]);

      $router->delete('/{moduleId}', [
        'uses' => 'ModulesController@deleteModule',
      ]);
    });

    /**
     * Button module routes
     */
    $router->group(['prefix' => 'button-modules'], function () use ($router) {
      $router->get('/', [
        'uses' => 'ButtonModulesController@getButtonModules',
      ]);

      $router->get('/{moduleId}', [
        'uses' => 'ButtonModulesController@getButtonModule',
      ]);

      $router->post('/', [
        'uses' => 'ButtonModulesController@createButtonModule',
      ]);

      $router->put('/{moduleId}', [
        'uses' => 'ButtonModulesController@updateButtonModule',
      ]);

      $router->delete('/{moduleId}', [
        'uses' => 'ButtonModulesController@deleteButtonModule',
      ]);
    });

    /**
     * Text module routes
     */
    $router->group(['prefix' => 'text-modules'], function () use ($router) {
      $router->get('/', [
        'uses' => 'TextModulesController@getTextModules',
      ]);

      $router->get('/{moduleId}', [
        'uses' => 'TextModulesController@getTextModule',
      ]);

      $router->post('/', [
        'uses' => 'TextModulesController@createTextModule',
      ]);

      $router->put('/{moduleId}', [
        'uses' => 'TextModulesController@updateTextModule',
      ]);

      $router->delete('/{moduleId}', [
        'uses' => 'TextModulesController@deleteTextModule',
      ]);
    });

    /**
     * Html module routes
     */
    $router->group(['prefix' => 'html-modules'], function () use ($router) {
      $router->get('/', [
        'uses' => 'HtmlModulesController@getHtmlModules',
      ]);

      $router->get('/{moduleId}', [
        'uses' => 'HtmlModulesController@getHtmlModule',
      ]);

      $router->post('/', [
        'uses' => 'HtmlModulesController@createHtmlModule',
      ]);

      $router->put('/{moduleId}', [
        'uses' => 'HtmlModulesController@updateHtmlModule',
      ]);

      $router->delete('/{moduleId}', [
        'uses' => 'HtmlModulesController@deleteHtmlModule',
      ]);
    });

    /**
     * Navigation module routes
     */
    $router->group(['prefix' => 'navigation-modules'], function () use (
      $router
    ) {
      $router->get('/', [
        'uses' => 'NavigationModulesController@getNavigationModules',
      ]);

      $router->get('/{moduleId}', [
        'uses' => 'NavigationModulesController@getNavigationModule',
      ]);

      $router->post('/', [
        'uses' => 'NavigationModulesController@createNavigationModule',
      ]);

      $router->put('/{moduleId}', [
        'uses' => 'NavigationModulesController@updateNavigationModule',
      ]);

      $router->delete('/{moduleId}', [
        'uses' => 'NavigationModulesController@deleteNavigationModule',
      ]);
    });

    /**
     * Catalog listing module routes
     */
    $router->group(['prefix' => 'catalog-listing-modules'], function () use (
      $router
    ) {
      $router->get('/', [
        'uses' => 'CatalogListingModulesController@getCatalogListingModules',
      ]);

      $router->get('/{moduleId}', [
        'uses' => 'CatalogListingModulesController@getCatalogListingModule',
      ]);

      $router->post('/', [
        'uses' => 'CatalogListingModulesController@createCatalogListingModule',
      ]);

      $router->put('/{moduleId}', [
        'uses' => 'CatalogListingModulesController@updateCatalogListingModule',
      ]);

      $router->delete('/{moduleId}', [
        'uses' => 'CatalogListingModulesController@deleteCatalogListingModule',
      ]);
    });

    /**
     * Catalog item module routes
     */
    $router->group(['prefix' => 'catalog-item-modules'], function () use (
      $router
    ) {
      $router->get('/', [
        'uses' => 'CatalogItemModulesController@getCatalogItemModules',
      ]);

      $router->get('/{moduleId}', [
        'uses' => 'CatalogItemModulesController@getCatalogItemModule',
      ]);

      $router->post('/', [
        'uses' => 'CatalogItemModulesController@createCatalogItemModule',
      ]);

      $router->put('/{moduleId}', [
        'uses' => 'CatalogItemModulesController@updateCatalogItemModule',
      ]);

      $router->delete('/{moduleId}', [
        'uses' => 'CatalogItemModulesController@deleteCatalogItemModule',
      ]);
    });

    /**
     * Catalog detail module routes
     */
    $router->group(['prefix' => 'catalog-detail-modules'], function () use (
      $router
    ) {
      $router->get('/', [
        'uses' => 'CatalogDetailModulesController@getCatalogDetailModules',
      ]);

      $router->get('/{moduleId}', [
        'uses' => 'CatalogDetailModulesController@getCatalogDetailModule',
      ]);

      $router->post('/', [
        'uses' => 'CatalogDetailModulesController@createCatalogDetailModule',
      ]);

      $router->put('/{moduleId}', [
        'uses' => 'CatalogDetailModulesController@updateCatalogDetailModule',
      ]);

      $router->delete('/{moduleId}', [
        'uses' => 'CatalogDetailModulesController@deleteCatalogDetailModule',
      ]);
    });

    /**
     * Catalog search module routes
     */
    $router->group(['prefix' => 'catalog-search-modules'], function () use (
      $router
    ) {
      $router->get('/', [
        'uses' => 'CatalogSearchModulesController@getCatalogSearchModules',
      ]);

      $router->get('/{moduleId}', [
        'uses' => 'CatalogSearchModulesController@getCatalogSearchModule',
      ]);

      $router->post('/', [
        'uses' => 'CatalogSearchModulesController@createCatalogSearchModule',
      ]);

      $router->put('/{moduleId}', [
        'uses' => 'CatalogSearchModulesController@updateCatalogSearchModule',
      ]);

      $router->delete('/{moduleId}', [
        'uses' => 'CatalogSearchModulesController@deleteCatalogSearchModule',
      ]);
    });

    /**
     * Catalog category tree module routes
     */
    $router->group(
      ['prefix' => 'catalog-category-tree-modules'],
      function () use ($router) {
        $router->get('/', [
          'uses' =>
            'CatalogCategoryTreeModulesController@getCatalogCategoryTreeModules',
        ]);

        $router->get('/{moduleId}', [
          'uses' =>
            'CatalogCategoryTreeModulesController@getCatalogCategoryTreeModule',
        ]);

        $router->post('/', [
          'uses' =>
            'CatalogCategoryTreeModulesController@createCatalogCategoryTreeModule',
        ]);

        $router->put('/{moduleId}', [
          'uses' =>
            'CatalogCategoryTreeModulesController@updateCatalogCategoryTreeModule',
        ]);

        $router->delete('/{moduleId}', [
          'uses' =>
            'CatalogCategoryTreeModulesController@deleteCatalogCategoryTreeModule',
        ]);
      }
    );

    /**
     * Catalog category module routes
     */
    $router->group(['prefix' => 'catalog-category-modules'], function () use (
      $router
    ) {
      $router->get('/', [
        'uses' => 'CatalogCategoryModulesController@getCatalogCategoryModules',
      ]);

      $router->get('/{moduleId}', [
        'uses' => 'CatalogCategoryModulesController@getCatalogCategoryModule',
      ]);

      $router->post('/', [
        'uses' =>
          'CatalogCategoryModulesController@createCatalogCategoryModule',
      ]);

      $router->put('/{moduleId}', [
        'uses' =>
          'CatalogCategoryModulesController@updateCatalogCategoryModule',
      ]);

      $router->delete('/{moduleId}', [
        'uses' =>
          'CatalogCategoryModulesController@deleteCatalogCategoryModule',
      ]);
    });

    /**
     * Image module routes
     */
    $router->group(['prefix' => 'image-modules'], function () use ($router) {
      $router->get('/', [
        'uses' => 'ImageModulesController@getImageModules',
      ]);

      $router->get('/{moduleId}', [
        'uses' => 'ImageModulesController@getImageModule',
      ]);

      $router->post('/', [
        'uses' => 'ImageModulesController@createImageModule',
      ]);

      $router->put('/{moduleId}', [
        'uses' => 'ImageModulesController@updateImageModule',
      ]);

      $router->delete('/{moduleId}', [
        'uses' => 'ImageModulesController@deleteImageModule',
      ]);
    });

    /**
     * Heading module routes
     */
    $router->group(['prefix' => 'heading-modules'], function () use ($router) {
      $router->get('/', [
        'uses' => 'HeadingModulesController@getHeadingModules',
      ]);

      $router->get('/{moduleId}', [
        'uses' => 'HeadingModulesController@getHeadingModule',
      ]);

      $router->post('/', [
        'uses' => 'HeadingModulesController@createHeadingModule',
      ]);

      $router->put('/{moduleId}', [
        'uses' => 'HeadingModulesController@updateHeadingModule',
      ]);

      $router->delete('/{moduleId}', [
        'uses' => 'HeadingModulesController@deleteHeadingModule',
      ]);
    });

    /**
     * View routes
     */
    $router->group(['prefix' => 'views'], function () use ($router) {
      $router->get('/', [
        'uses' => 'ViewsController@getViews',
      ]);

      $router->get('/all', [
        'uses' => 'ViewsController@getAllViews',
      ]);

      $router->get('/{viewId}', [
        'uses' => 'ViewsController@getView',
      ]);

      $router->post('/', [
        'uses' => 'ViewsController@createView',
      ]);

      $router->put('/{viewId}', [
        'uses' => 'ViewsController@updateView',
      ]);

      $router->delete('/{viewId}', [
        'uses' => 'ViewsController@deleteView',
      ]);
    });

    /**
     * Variable name actions routes
     */
    $router->group(['prefix' => 'variable-name-actions'], function () use (
      $router
    ) {
      $router->get('/', [
        'uses' => 'VariableNameActionsController@getVariableNameActions',
      ]);

      $router->post('/', [
        'uses' => 'VariableNameActionsController@createVariableNameAction',
      ]);

      $router->get('/{variableNameActionId}', [
        'uses' => 'VariableNameActionsController@getVariableNameAction',
      ]);

      $router->put('/{variableNameActionId}', [
        'uses' => 'VariableNameActionsController@updateVariableNameAction',
      ]);

      $router->delete('/{variableNameActionId}', [
        'uses' => 'VariableNameActionsController@deleteVariableNameAction',
      ]);
    });

    /**
     * Settings routes
     */
    $router->group(['prefix' => 'settings'], function () use ($router) {
      $router->get('/', [
        'uses' => 'SettingsController@getSettings',
      ]);

      $router->get('/{settingId}', [
        'uses' => 'SettingsController@getSetting',
      ]);

      $router->post('/', [
        'uses' => 'SettingsController@createSetting',
      ]);

      $router->put('/{settingId}', [
        'uses' => 'SettingsController@updateSetting',
      ]);

      $router->delete('/{settingId}', [
        'uses' => 'SettingsController@deleteSetting',
      ]);
    });

    /**
     * Settings Categories routes
     */
    $router->group(['prefix' => 'settings-categories'], function () use (
      $router
    ) {
      $router->get('/', [
        'uses' => 'SettingsCategoriesController@getSettingsCategories',
      ]);

      $router->get('/{settingCategoryId}', [
        'uses' => 'SettingsCategoriesController@getSettingsCategory',
      ]);

      $router->post('/', [
        'uses' => 'SettingsCategoriesController@createSettingsCategory',
      ]);

      $router->put('/{settingsCategoryId}', [
        'uses' => 'SettingsCategoriesController@updateSettingsCategory',
      ]);

      $router->delete('/{settingsCategoryId}', [
        'uses' => 'SettingsCategoriesController@deleteSettingsCategory',
      ]);
    });

    /**
     * Catalog languages routes
     */
    $router->group(['prefix' => 'catalog-languages'], function () use (
      $router
    ) {
      $router->get('/', [
        'uses' => 'CatalogLanguagesController@getCatalogLanguages',
      ]);

      $router->get('/all', [
        'uses' => 'CatalogLanguagesController@getAllCatalogLanguages',
      ]);

      $router->get('/{code}', [
        'uses' => 'CatalogLanguagesController@getCatalogLanguage',
      ]);

      $router->post('/', [
        'uses' => 'CatalogLanguagesController@createCatalogLanguage',
      ]);

      $router->put('/{code}', [
        'uses' => 'CatalogLanguagesController@updateCatalogLanguage',
      ]);

      $router->delete('/{code}', [
        'uses' => 'CatalogLanguagesController@deleteCatalogLanguage',
      ]);
    });

    /**
     * Catalog currencies routes
     */

    $router->group(['prefix' => 'catalog-currencies'], function () use (
      $router
    ) {
      $router->get('/', [
        'uses' => 'CatalogCurrenciesController@getCatalogCurrencies',
      ]);

      $router->get('/all', [
        'uses' => 'CatalogCurrenciesController@getAllCatalogCurrencies',
      ]);

      $router->get('/tax-rates', [
        'uses' =>
          'CatalogCurrencyTaxRatesController@getAllCatalogCurrencyTaxRates',
      ]);

      $router->get('/{catalogCurrencyId}', [
        'uses' => 'CatalogCurrenciesController@getCatalogCurrency',
      ]);

      $router->post('/', [
        'uses' => 'CatalogCurrenciesController@createCatalogCurrency',
      ]);

      $router->put('/{catalogCurrencyId}', [
        'uses' => 'CatalogCurrenciesController@updateCatalogCurrency',
      ]);

      /**
       * Catalog currency tax rates routes
       */

      $router->group(
        ['prefix' => '/{catalogCurrencyId}/tax-rates'],
        function () use ($router) {
          $router->get('/', [
            'uses' =>
              'CatalogCurrencyTaxRatesController@getCatalogCurrencyTaxRates',
          ]);

          $router->get('/all', [
            'uses' =>
              'CatalogCurrencyTaxRatesController@getAllCatalogCurrencyTaxRates',
          ]);

          $router->get('/{catalogCurrencyTaxRateId}', [
            'uses' =>
              'CatalogCurrencyTaxRatesController@getCatalogCurrencyTaxRate',
          ]);

          $router->post('/', [
            'uses' =>
              'CatalogCurrencyTaxRatesController@createCatalogCurrencyTaxRate',
          ]);

          $router->put('/{catalogCurrencyTaxRateId}', [
            'uses' =>
              'CatalogCurrencyTaxRatesController@updateCatalogCurrencyTaxRate',
          ]);

          $router->delete('/{catalogCurrencyTaxRateId}', [
            'uses' =>
              'CatalogCurrencyTaxRatesController@deleteCatalogCurrencyTaxRate',
          ]);
        }
      );
    });

    /**
     * Catalog categories routes
     */
    $router->group(['prefix' => 'catalog-categories'], function () use (
      $router
    ) {
      $router->get('/', [
        'uses' => 'CatalogCategoriesController@getCatalogCategories',
      ]);

      $router->get('/{catalogCategoryId}', [
        'uses' => 'CatalogCategoriesController@getCatalogCategory',
      ]);

      $router->post('/', [
        'uses' => 'CatalogCategoriesController@createCatalogCategory',
      ]);

      $router->put('/{catalogCategoryId}', [
        'uses' => 'CatalogCategoriesController@updateCatalogCategory',
      ]);

      $router->put('/{catalogCategoryId}/publish', [
        'uses' => 'CatalogCategoriesController@publishCatalogCategory',
      ]);

      $router->put('/{catalogCategoryId}/unpublish', [
        'uses' => 'CatalogCategoriesController@unpublishCatalogCategory',
      ]);

      $router->delete('/{catalogCategoryId}', [
        'uses' => 'CatalogCategoriesController@deleteCatalogCategory',
      ]);
    });

    /**
     * Catalog items routes
     */
    $router->group(['prefix' => 'catalog-items'], function () use ($router) {
      $router->get('/', [
        'uses' => 'CatalogItemsController@getCatalogItems',
      ]);

      $router->get('/public', [
        'uses' => 'CatalogItemsController@getPublicCatalogItems',
      ]);

      $router->get('/{catalogItemId}', [
        'uses' => 'CatalogItemsController@getCatalogItem',
      ]);

      $router->get('/{catalogItemId}/public', [
        'uses' => 'CatalogItemsController@getPublicCatalogItem',
      ]);

      $router->get('/{catalogItemId}', [
        'uses' => 'CatalogItemsController@getCatalogItem',
      ]);

      $router->post('/', [
        'uses' => 'CatalogItemsController@createCatalogItem',
      ]);

      $router->put('/{catalogItemId}', [
        'uses' => 'CatalogItemsController@updateCatalogItem',
      ]);

      $router->put('/{catalogItemId}/publish', [
        'uses' => 'CatalogItemsController@publishCatalogItem',
      ]);

      $router->put('/{catalogItemId}/unpublish', [
        'uses' => 'CatalogItemsController@unpublishCatalogItem',
      ]);

      $router->put('/{catalogItemId}/book', [
        'uses' => 'CatalogItemsController@bookCatalogItem',
      ]);

      $router->put('/{catalogItemId}/unbook', [
        'uses' => 'CatalogItemsController@unbookCatalogItem',
      ]);

      $router->delete('/{catalogItemId}', [
        'uses' => 'CatalogItemsController@deleteCatalogItem',
      ]);

      /**
       * Catalog item categories routes
       */
      $router->group(
        ['prefix' => '/{catalogItemId}/categories'],
        function () use ($router) {
          $router->get('/', [
            'uses' =>
              'CatalogItemCategoriesController@getCatalogItemCategories',
          ]);

          $router->put('/', [
            'uses' =>
              'CatalogItemCategoriesController@setCatalogItemCategories',
          ]);
        }
      );
    });

    /**
     * Catalog item tempaltes routes
     */
    $router->group(['prefix' => 'catalog-item-templates'], function () use (
      $router
    ) {
      $router->get('/', [
        'uses' => 'CatalogItemTemplatesController@getCatalogItemTemplates',
      ]);

      $router->get('/all', [
        'uses' => 'CatalogItemTemplatesController@getAllCatalogItemTemplates',
      ]);

      $router->get('/{catalogItemTemplateId}', [
        'uses' => 'CatalogItemTemplatesController@getCatalogItemTemplate',
      ]);

      $router->post('/', [
        'uses' => 'CatalogItemTemplatesController@createCatalogItemTemplate',
      ]);

      $router->put('/{catalogItemTemplateId}', [
        'uses' => 'CatalogItemTemplatesController@updateCatalogItemTemplate',
      ]);

      $router->delete('/{catalogItemTemplateId}', [
        'uses' => 'CatalogItemTemplatesController@deleteCatalogItemTemplate',
      ]);

      /**
       * Catalog item tempalte fields routes
       */
      $router->group(
        ['prefix' => '{catalogItemTemplateId}/fields'],
        function () use ($router) {
          $router->get('/', [
            'uses' =>
              'CatalogItemTemplateFieldsController@getCatalogItemTemplateFields',
          ]);

          $router->get('/{catalogItemTemplateFieldId}', [
            'uses' =>
              'CatalogItemTemplateFieldsController@getCatalogItemTemplateField',
          ]);

          $router->post('/', [
            'uses' =>
              'CatalogItemTemplateFieldsController@createCatalogItemTemplateField',
          ]);

          $router->put('/{catalogItemTemplateFieldId}', [
            'uses' =>
              'CatalogItemTemplateFieldsController@updateCatalogItemTemplateField',
          ]);

          $router->delete('/{catalogItemTemplateFieldId}', [
            'uses' =>
              'CatalogItemTemplateFieldsController@deleteCatalogItemTemplateField',
          ]);
        }
      );

      /**
       * Catalog item tempalte field values routes
       */
      $router->group(
        ['prefix' => '{catalogItemTemplateId}/values'],
        function () use ($router) {
          $router->put('/', [
            'uses' =>
              'CatalogItemTemplateFieldValuesController@updateCatalogItemTemplateFieldValues',
          ]);
        }
      );
    });

    $router->group(['prefix' => 'orders'], function () use ($router) {
      $router->get('/', [
        'uses' => 'OrdersController@getOrders',
      ]);

      $router->get('/{orderId}', [
        'uses' => 'OrdersController@getOrder',
      ]);

      $router->put('/{orderId}/transition', [
        'uses' => 'OrdersController@changeOrderState',
      ]);

      $router->put('/{orderId}/note', [
        'uses' => 'OrdersController@changeOrderNote',
      ]);

      $router->delete('/{orderId}', [
        'uses' => 'OrdersController@deleteOrder',
      ]);
    });

    /**
     * Email templates routes
     */
    $router->group(['prefix' => 'email-templates'], function () use ($router) {
      $router->get('/', [
        'uses' => 'EmailTemplatesController@getEmailTemplates',
      ]);

      $router->get('/{emailTemplateId}', [
        'uses' => 'EmailTemplatesController@getEmailTemplate',
      ]);

      $router->post('/', [
        'uses' => 'EmailTemplatesController@createEmailTemplate',
      ]);

      $router->put('/{emailTemplateId}', [
        'uses' => 'EmailTemplatesController@updateEmailTemplate',
      ]);

      $router->delete('/{emailTemplateId}', [
        'uses' => 'EmailTemplatesController@deleteEmailTemplate',
      ]);
    });

    /**
     * File manager routes
     */
    $router->group(['prefix' => 'filemanager'], function () use ($router) {
      $router->post('/', [
        'uses' => 'FileManagerController@uploadFile',
      ]);
    });
  });
});

/**
 * Public router
 */

$router->get('/{route:.*}/', [
  'uses' => 'PublicRouterController@renderPage',
]);

$router->post('/system/proccess-order/{languageCode}/{catalogItemId}', [
  'uses' => 'OrdersController@submitOrder',
]);
