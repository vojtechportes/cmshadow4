import axios, { AxiosPromise } from 'axios'
import { RequestConfig } from './requestConfig'
import { CatalogCurrencyTaxRate } from 'model/api/CatalogCurrencyTaxRate'
import { PaginatedList } from 'model/api/PaginatedList'

export class CatalogCurrencyTaxRatesApi {
  /**
   * Get Catalog Currency Tax Rates
   * 
   * @param catalogCurrencyId
   * @param page
   * @param pageSize
   */
  static getCatalogCurrencyTaxRates(
    catalogCurrencyId: number,
    page?: number,
    pageSize?: number,
    config?: RequestConfig
  ): AxiosPromise<PaginatedList<CatalogCurrencyTaxRate>> {
    return axios({
      ...config,
      method: 'GET',
      url: `/catalog-currencies/${catalogCurrencyId}/tax-rates`,
      params: {
        page,
        per_page: pageSize,
      },
    })
  }

  /**
   * Get All Catalog Currencies
   * 
   * @param catalogCurrencyId
   */
  static getAllCatalogCurrencyTaxRates(
    catalogCurrencyId?: number,
    config?: RequestConfig
  ): AxiosPromise<CatalogCurrencyTaxRate[]> {
    let url = '';

    if (catalogCurrencyId) {
      url = `/catalog-currencies/${catalogCurrencyId}/all`
    } else {
      url = `/catalog-currencies/tax-rates`
    }

    return axios({
      ...config,
      method: 'GET',
      url,
    })
  }

  /**
   * Get Catalog Currency Tax Rate
   *
   * @param catalogCurrencyId
   * @param catalogCurrencyTaxRateId
   */
  static getCatalogCurrencyTaxRate(
    catalogCurrencyId: number,
    catalogCurrencyTaxRateId: number,
    config?: RequestConfig
  ): AxiosPromise<CatalogCurrencyTaxRate> {
    return axios({
      ...config,
      method: 'GET',
      url: `/catalog-currencies/${catalogCurrencyId}/tax-rates/${catalogCurrencyTaxRateId}`,
    })
  }

  /**
   * Create Catalog Currency Tax Rate
   *
   * @param catalogCurrencyId
   * @param data
   */
  static createCatalogCurrencyTaxRate(
    catalogCurrencyId: number,
    data: FormData,
    config?: RequestConfig
  ): AxiosPromise {
    return axios({
      ...config,
      method: 'POST',
      url: `/catalog-currencies/${catalogCurrencyId}/tax-rates`,
      data,
    })
  }

  /**
   * Update Catalog Currency Tax Rate
   *
   * @param catalogCurrencyId
   * @param catalogCurrencyTaxRateId
   * @param data
   */
  static updateCatalogCurrencyTaxRate(
    catalogCurrencyId: number,
    catalogCurrencyTaxRateId: number,
    data: FormData,
    config?: RequestConfig
  ): AxiosPromise {
    return axios({
      ...config,
      method: 'PUT',
      url: `/catalog-currencies/${catalogCurrencyId}/tax-rates/${catalogCurrencyTaxRateId}`,
      data,
    })
  }

  /**
   * Delete Catalog Currency Tax Rate
   *
   * @param catalogCurrencyId
   * @param catalogCurrencyTaxRateId
   */
  static deleteCatalogCurrencyTaxRate(
    catalogCurrencyId: number,
    catalogCurrencyTaxRateId: number,
    config?: RequestConfig
  ): AxiosPromise {
    return axios({
      ...config,
      method: 'DELETE',
      url: `/catalog-currencies/${catalogCurrencyId}/tax-rates/${catalogCurrencyTaxRateId}`,
    })
  }
}
