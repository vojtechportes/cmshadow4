import axios, { AxiosPromise } from 'axios'
import { RequestConfig } from './requestConfig'
import { CatalogItem } from 'model/api/CatalogItem'
import { PaginatedList } from 'model/api/PaginatedList'
import { CatalogItemDetail } from 'model/api/CatalogItemDetail'
import { CatalogItemPublic } from 'model/api/CatalogItemPublic'

export class CatalogItemsApi {
  /**
   * Get Catalog Items
   *
   * @param page
   * @param pageSize
   * @param categories
   * @param name
   * @param sku
   */
  static getCatalogItems(
    page?: number,
    pageSize?: number,
    categories?: number[],
    name?: string,
    sku?: string,
    config?: RequestConfig
  ): AxiosPromise<PaginatedList<CatalogItem>> {
    return axios({
      ...config,
      method: 'GET',
      url: `/catalog-items`,
      params: {
        page,
        per_page: pageSize,
        category: categories,
        name,
        sku,
      },
    })
  }

  static getPublicCatalogItems(
    page?: number,
    pageSize?: number,
    languageCode?: string,
    categoryId?: number,
    config?: RequestConfig
  ): AxiosPromise<PaginatedList<CatalogItemPublic>> {
    return axios({
      ...config,
      method: 'GET',
      url: `/catalog-items/public`,
      params: {
        page,
        per_page: pageSize,
        language_code: languageCode,
        category_id: categoryId,
      },
    })
  }

  static getPublicCatalogItem(
    catalogItemId: number,
    language: string = null,
    isListing: boolean = false,
    config?: RequestConfig
  ): AxiosPromise<CatalogItemPublic> {
    return axios({
      ...config,
      method: 'GET',
      url: `/catalog-items/${catalogItemId}/public`,
      params: {
        language,
        is_listing: +isListing,
      },
    })
  }

  /**
   * Get Catalog Item
   *
   * @param catalogItemId
   */
  static getCatalogItem(
    catalogItemId: number,
    config?: RequestConfig
  ): AxiosPromise<CatalogItemDetail> {
    return axios({
      ...config,
      method: 'GET',
      url: `/catalog-items/${catalogItemId}`,
    })
  }

  /**
   * Create Catalog Item
   *
   * @param data
   */
  static createCatalogItem(
    data: FormData,
    config?: RequestConfig
  ): AxiosPromise<{ id: number }> {
    return axios({
      ...config,
      method: 'POST',
      url: `/catalog-items`,
      data,
    })
  }

  /**
   * Update Catalog Item
   *
   * @param catalogItemId
   * @param data
   */
  static updateCatalogItem(
    catalogItemId: number,
    data: FormData,
    config?: RequestConfig
  ): AxiosPromise {
    return axios({
      ...config,
      method: 'PUT',
      url: `/catalog-items/${catalogItemId}`,
      data,
    })
  }

  /**
   * Publish Catalog Item
   *
   * @param catalogItemId
   */
  static publishCatalogItem(
    catalogItemId: number,
    config?: RequestConfig
  ): AxiosPromise {
    return axios({
      ...config,
      method: 'PUT',
      url: `/catalog-items/${catalogItemId}/publish`,
    })
  }

  /**
   * Unpublish Catalog Item
   *
   * @param catalogItemId
   */
  static unpublishCatalogItem(
    catalogItemId: number,
    config?: RequestConfig
  ): AxiosPromise {
    return axios({
      ...config,
      method: 'PUT',
      url: `/catalog-items/${catalogItemId}/unpublish`,
    })
  }

  /**
   * Book Catalog Item
   *
   * @param catalogItemId
   */
  static bookCatalogItem(
    catalogItemId: number,
    config?: RequestConfig
  ): AxiosPromise {
    return axios({
      ...config,
      method: 'PUT',
      url: `/catalog-items/${catalogItemId}/book`,
    })
  }

  /**
   * Unbook Catalog Item
   *
   * @param catalogItemId
   */
  static unbookCatalogItem(
    catalogItemId: number,
    config?: RequestConfig
  ): AxiosPromise {
    return axios({
      ...config,
      method: 'PUT',
      url: `/catalog-items/${catalogItemId}/unbook`,
    })
  }

  /**
   * Delete Catalog Item
   *
   * @param catalogItemId
   */
  static deleteCatalogItem(
    catalogItemId: number,
    config?: RequestConfig
  ): AxiosPromise {
    return axios({
      ...config,
      method: 'DELETE',
      url: `/catalog-items/${catalogItemId}`,
    })
  }
}
