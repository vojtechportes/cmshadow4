import axios, { AxiosPromise } from 'axios'
import { RequestConfig } from './requestConfig'
import { CatalogSearchModule } from 'model/api/CatalogSearchModule'

export class CatalogSearchModulesApi {
  /**
   * Get Catalog Search Module
   *
   * @param moduleId
   */
  static getCatalogSearchModule(
    moduleId: number,
    config?: RequestConfig
  ): AxiosPromise<CatalogSearchModule> {
    return axios({
      ...config,
      method: 'GET',
      url: `/catalog-search-modules/${moduleId}`,
    })
  }
}
