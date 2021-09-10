import axios, { AxiosPromise } from 'axios'
import { RequestConfig } from './requestConfig'
import { CatalogCategoryTreeModule } from 'model/api/CatalogCategoryTreeModule'

export class CatalogCategoryTreeModulesApi {
  /**
   * Get Catalog Category Tree Module
   *
   * @param moduleId
   */
  static getCatalogCategoryTreeModule(
    moduleId: number,
    config?: RequestConfig
  ): AxiosPromise<CatalogCategoryTreeModule> {
    return axios({
      ...config,
      method: 'GET',
      url: `/catalog-category-tree-modules/${moduleId}`,
    })
  }
}
