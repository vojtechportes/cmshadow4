import axios, { AxiosPromise } from 'axios'
import { RequestConfig } from './requestConfig'
import { ImageModule } from 'model/api/ImageModule'

export class ImageModulesApi {
  /**
   * Get Image Module
   *
   * @param moduleId
   */
  static getImageModule(
    moduleId: number,
    config?: RequestConfig
  ): AxiosPromise<ImageModule> {
    return axios({
      ...config,
      method: 'GET',
      url: `/image-modules/${moduleId}`,
    })
  }
}
