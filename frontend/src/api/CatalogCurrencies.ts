import axios, { AxiosPromise } from 'axios'
import { RequestConfig } from './requestConfig'
import { CatalogCurrency } from 'model/api/CatalogCurrency'
import { PaginatedList } from 'model/api/PaginatedList'

export class CatalogCurrenciesApi {
  /**
   * Get Catalog Currencies
   *
   * @param page
   * @param pageSize
   */
  static getCatalogCurrencies(
    page?: number,
    pageSize?: number,
    config?: RequestConfig
  ): AxiosPromise<PaginatedList<CatalogCurrency>> {
    return axios({
      ...config,
      method: 'GET',
      url: `/catalog-currencies`,
      params: {
        page,
        per_page: pageSize,
      },
    })
  }

  /**
   * Get All Catalog Currencies
   */
  static getAllCatalogCurrencies(
    config?: RequestConfig
  ): AxiosPromise<CatalogCurrency[]> {
    return axios({
      ...config,
      method: 'GET',
      url: `/catalog-currencies/all`,
    })
  }

  /**
   * Get Catalog Currency
   *
   * @param catalogCurrencyId
   */
  static getCatalogCurrency(
    catalogCurrencyId: number,
    config?: RequestConfig
  ): AxiosPromise<CatalogCurrency> {
    return axios({
      ...config,
      method: 'GET',
      url: `/catalog-currencies/${catalogCurrencyId}`,
    })
  }

  /**
   * Create Catalog Currency
   *
   * @param data
   */
  static createCatalogCurrency(
    data: FormData,
    config?: RequestConfig
  ): AxiosPromise<{ id: number }> {
    return axios({
      ...config,
      method: 'POST',
      url: `/catalog-currencies`,
      data,
    })
  }

  /**
   * Update Catalog Currency
   *
   * @param catalogCurrencyId
   * @param data
   */
  static updateCatalogCurrency(
    catalogCurrencyId: number,
    data: FormData,
    config?: RequestConfig
  ): AxiosPromise {
    return axios({
      ...config,
      method: 'PUT',
      url: `/catalog-currencies/${catalogCurrencyId}`,
      data,
    })
  }

  /**
   * Delete Catalog Currency
   *
   * @param catalogCurrencyId
   */
  static deleteCatalogCurrency(
    catalogCurrencyId: number,
    config?: RequestConfig
  ): AxiosPromise {
    return axios({
      ...config,
      method: 'DELETE',
      url: `/catalog-currencies/${catalogCurrencyId}`,
    })
  }
}
