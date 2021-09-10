import axios, { AxiosPromise } from 'axios'
import { RequestConfig } from './requestConfig'

export class CatalogItemCategoriesApi {
  /**
   * Get Catalog Item Categories
   *
   * @param catalogItemId
   */
  static getCatalogItemCategories(
    catalogItemId: number,
    config?: RequestConfig
  ): AxiosPromise<number[]> {
    return axios({
      ...config,
      method: 'GET',
      url: `/catalog-items/${catalogItemId}/categories`,
    })
  }

  /**
   * Set Catalog Item Categories
   *
   * @param data
   * @param catalogItemId
   */
  static setCatalogItemCategories(
    data: FormData,
    catalogItemId: number,
    config?: RequestConfig
  ): AxiosPromise {
    return axios({
      ...config,
      method: 'PUT',
      url: `/catalog-items/${catalogItemId}/categories`,
      data,
    })
  }
}