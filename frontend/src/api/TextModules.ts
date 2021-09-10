import axios, { AxiosPromise } from 'axios'
import { RequestConfig } from './requestConfig'
import { TextModule } from 'model/api/TextModule'

export class TextModulesApi {
  /**
   * Get Text Module
   *
   * @param moduleId
   */
  static getTextModule(
    moduleId: number,
    config?: RequestConfig
  ): AxiosPromise<TextModule> {
    return axios({
      ...config,
      method: 'GET',
      url: `/text-modules/${moduleId}`,
    })
  }
}
