import axios, { AxiosPromise } from 'axios'
import { RequestConfig } from './requestConfig'
import { HtmlModule } from 'model/api/HtmlModule'

export class HtmlModulesApi {
  /**
   * Get Html Module
   *
   * @param moduleId
   */
  static getHtmlModule(
    moduleId: number,
    config?: RequestConfig
  ): AxiosPromise<HtmlModule> {
    return axios({
      ...config,
      method: 'GET',
      url: `/html-modules/${moduleId}`,
    })
  }
}
