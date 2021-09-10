import axios, { AxiosPromise } from 'axios'
import { RequestConfig } from './requestConfig'
import { CatalogCategoryModule } from 'model/api/CatalogCategoryModule'

export class CatalogCategoryModulesApi {
  /**
   * Get Catalog Category Module
   *
   * @param moduleId
   */
  static getCatalogCategoryModule(
    moduleId: number,
    config?: RequestConfig
  ): AxiosPromise<CatalogCategoryModule> {
    return axios({
      ...config,
      method: 'GET',
      url: `/catalog-category-modules/${moduleId}`,
    })
  }
}
