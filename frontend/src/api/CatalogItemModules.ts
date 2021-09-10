import axios, { AxiosPromise } from 'axios'
import { RequestConfig } from './requestConfig'
import { CatalogItemModule } from 'model/api/CatalogItemModule'

export class CatalogItemModulesApi {
  /**
   * Get Catalog Item Module
   *
   * @param moduleId
   */
  static getCatalogItemModule(
    moduleId: number,
    config?: RequestConfig
  ): AxiosPromise<CatalogItemModule> {
    return axios({
      ...config,
      method: 'GET',
      url: `/catalog-item-modules/${moduleId}`,
    })
  }
}
