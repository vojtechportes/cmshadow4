import axios, { AxiosPromise } from 'axios'
import { RequestConfig } from './requestConfig'
import { CatalogLanguage } from 'model/api/CatalogLanguage'
import { PaginatedList } from 'model/api/PaginatedList'

export class CatalogLanguagesApi {
  /**
   * Get Catalog Languages
   *
   * @param page
   * @param pageSize
   */
  static getCatalogLanguages(
    page?: number,
    pageSize?: number,
    config?: RequestConfig
  ): AxiosPromise<PaginatedList<CatalogLanguage>> {
    return axios({
      ...config,
      method: 'GET',
      url: `/catalog-languages`,
      params: {
        page,
        per_page: pageSize,
      },
    })
  }

  /**
   * All Get Catalog Languages
   */
  static getAllCatalogLanguages(
    config?: RequestConfig
  ): AxiosPromise<CatalogLanguage[]> {
    return axios({
      ...config,
      method: 'GET',
      url: `/catalog-languages/all`,
    })
  }

  /**
   * Get Catalog Language
   *
   * @param code
   */
  static getCatalogLanguage(
    code: string,
    config?: RequestConfig
  ): AxiosPromise<CatalogLanguage> {
    return axios({
      ...config,
      method: 'GET',
      url: `/catalog-languages/${code}`,
    })
  }

  /**
   * Create Catalog Language
   *
   * @param data
   */
  static createCatalogLanguage(
    data: FormData,
    config?: RequestConfig
  ): AxiosPromise {
    return axios({
      ...config,
      method: 'POST',
      url: `/catalog-languages`,
      data,
    })
  }

  /**
   * Update Catalog Language
   *
   * @param code
   * @param data
   */
  static updateCatalogLanguage(
    code: string,
    data: FormData,
    config?: RequestConfig
  ): AxiosPromise {
    return axios({
      ...config,
      method: 'PUT',
      url: `/catalog-languages/${code}`,
      data,
    })
  }

  /**
   * Delete Catalog Language
   *
   * @param data
   */
  static deleteCatalogLanguage(
    code: string,
    config?: RequestConfig
  ): AxiosPromise {
    return axios({
      ...config,
      method: 'DELETE',
      url: `/catalog-languages/${code}`,
    })
  }
}
