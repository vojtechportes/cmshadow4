import axios, { AxiosPromise } from 'axios'
import { RequestConfig } from './requestConfig'
import { CatalogListingModule } from 'model/api/CatalogListingModule'

export class CatalogListingModulesApi {
  /**
   * Get Catalog Listing Module
   *
   * @param moduleId
   */
  static getCatalogListingModule(
    moduleId: number,
    config?: RequestConfig
  ): AxiosPromise<CatalogListingModule> {
    return axios({
      ...config,
      method: 'GET',
      url: `/catalog-listing-modules/${moduleId}`,
    })
  }
}
