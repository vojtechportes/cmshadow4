import axios, { AxiosPromise } from 'axios'
import { RequestConfig } from './requestConfig'
import { ButtonModule } from 'model/api/ButtonModule'

export class ButtonModulesApi {
  /**
   * Get Button Module
   *
   * @param moduleId
   */
  static getButtonModule(
    moduleId: number,
    config?: RequestConfig
  ): AxiosPromise<ButtonModule> {
    return axios({
      ...config,
      method: 'GET',
      url: `/button-modules/${moduleId}`,
    })
  }
}
