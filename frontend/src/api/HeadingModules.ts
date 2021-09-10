import axios, { AxiosPromise } from 'axios'
import { RequestConfig } from './requestConfig'
import { HeadingModule } from 'model/api/HeadingModule'

export class HeadingModulesApi {
  /**
   * Get Heading Module
   *
   * @param moduleId
   */
  static getHeadingModule(
    moduleId: number,
    config?: RequestConfig
  ): AxiosPromise<HeadingModule> {
    return axios({
      ...config,
      method: 'GET',
      url: `/heading-modules/${moduleId}`,
    })
  }
}
