import axios, { AxiosPromise } from 'axios'
import { RequestConfig } from './requestConfig'
import { NavigationModule } from 'model/api/NavigationModule'

export class NavigationModulesApi {
  /**
   * Get Navigation Module
   *
   * @param moduleId
   */
  static getNavigationModule(
    moduleId: number,
    config?: RequestConfig
  ): AxiosPromise<NavigationModule> {
    return axios({
      ...config,
      method: 'GET',
      url: `/navigation-modules/${moduleId}`,
    })
  }
}
