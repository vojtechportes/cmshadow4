import axios, { AxiosPromise } from 'axios'
import { RequestConfig } from './requestConfig'
import { FileManagerResponse } from 'model/api/FileManagerResponse'

export class FileManagerApi {
  /**
   * Upload file
   *
   * @param data
   */
  static upload(
    data: FormData,
    config?: RequestConfig
  ): AxiosPromise<FileManagerResponse> {
    if (!config) {
      config = {
        headers: {}
      }
    }

    return axios({
      ...config,
      headers: {
        ...config.headers,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      },
      data,
      method: 'POST',
      url: `/filemanager`,
    })
  }
}
