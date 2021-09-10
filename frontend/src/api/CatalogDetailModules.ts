import axios, { AxiosPromise } from 'axios'
import { RequestConfig } from './requestConfig'
import { CatalogDetailModule } from 'model/api/CatalogDetailModule'

export class CatalogDetailModulesApi {
  /**
   * Get Catalog Detail Module
   *
   * @param moduleId
   */
  static getCatalogDetailModule(
    moduleId: number,
    config?: RequestConfig
  ): AxiosPromise<CatalogDetailModule> {
    return axios({
      ...config,
      method: 'GET',
      url: `/catalog-detail-modules/${moduleId}`,
    })
  }
}
