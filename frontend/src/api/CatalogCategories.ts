import axios, { AxiosPromise } from 'axios'
import { RequestConfig } from './requestConfig'
import { CatalogCategory } from 'model/api/CatalogCategory'
import { CatalogCategoryDetail } from 'model/api/CatalogCategoryDetail'

export class CatalogCategoriesApi {
  /**
   * Get Catalog Categories
   */
  static getCatalogCategories(
    parentCategoryId?: number,
    publishedOnly?: boolean,
    withDetail?: boolean,
    languageCode?: string,
    config?: RequestConfig
  ): AxiosPromise<CatalogCategory[]> {
    return axios({
      ...config,
      method: 'GET',
      url: `/catalog-categories`,
      params: {
        parent_category_id: parentCategoryId,
        published_only: publishedOnly ? +publishedOnly : undefined,
        with_detail: withDetail ? +withDetail : undefined,
        language_code: languageCode,
      },
    })
  }

  /**
   * Get Catalog Category
   *
   * @param catalogCategoryId
   */
  static getCatalogCategory(
    catalogCategoryId: number,
    publishedOnly: true,
    config?: RequestConfig
  ): AxiosPromise<CatalogCategoryDetail> {
    return axios({
      ...config,
      method: 'GET',
      url: `/catalog-categories/${catalogCategoryId}`,
      params: {
        published_only: publishedOnly ? +publishedOnly : undefined,
      },
    })
  }

  /**
   * Create Catalog Category
   *
   * @param data
   */
  static createCatalogCategory(
    data: FormData,
    config?: RequestConfig
  ): AxiosPromise<{ id: number }> {
    return axios({
      ...config,
      method: 'POST',
      url: `/catalog-categories`,
      data,
    })
  }

  /**
   * Update Catalog Category
   *
   * @param catalogCategoryId
   * @param data
   */
  static updateCatalogCategory(
    catalogCategoryId: number,
    data: FormData,
    config?: RequestConfig
  ): AxiosPromise {
    return axios({
      ...config,
      method: 'PUT',
      url: `/catalog-categories/${catalogCategoryId}`,
      data,
    })
  }

  /**
   * Delete Catalog Category
   *
   * @param catalogCategoryId
   */
  static deleteCatalogCategory(
    catalogCategoryId: number,
    config?: RequestConfig
  ): AxiosPromise {
    return axios({
      ...config,
      method: 'DELETE',
      url: `/catalog-categories/${catalogCategoryId}`,
    })
  }

  /**
   * Publish Catalog Category
   *
   * @param catalogCategoryId
   */
  static publishCatalogCategory(
    catalogCategoryId: number,
    config?: RequestConfig
  ): AxiosPromise {
    return axios({
      ...config,
      method: 'PUT',
      url: `/catalog-categories/${catalogCategoryId}/publish`,
    })
  }

  /**
   * Unpublish Catalog Category
   *
   * @param catalogCategoryId
   */
  static unpublishCatalogCategory(
    catalogCategoryId: number,
    config?: RequestConfig
  ): AxiosPromise {
    return axios({
      ...config,
      method: 'PUT',
      url: `/catalog-categories/${catalogCategoryId}/unpublish`,
    })
  }
}
