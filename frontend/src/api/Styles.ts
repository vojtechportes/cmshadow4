import axios, { AxiosPromise } from 'axios'
import { RequestConfig } from './requestConfig'

export class StylesApi {
  /**
   * Get Template Pages
   *
   * @param theme
   * @param file
   */
  static getStyles(
    theme: string,
    file = 'main.css',
    config?: RequestConfig
  ): AxiosPromise<string> {
    const axiosInstance = axios.create()

    return axiosInstance({
      ...config,
      method: 'GET',
      url: `/storage/themes/${theme}/${file}`,
    })
  }
}