import axios, { AxiosPromise } from 'axios'
import { RequestConfig } from './requestConfig'
import { Login } from 'model/api/Login'

export class UserApi {
  /**
   * Login
   */
  static login(
    data: FormData,
    config?: RequestConfig
  ): AxiosPromise<Login> {
    return axios({
      ...config,
      method: 'POST',
      url: `/login`,
      data
    })
  }

  /**
   * Logout
   */
  static logout(
    config?: RequestConfig
  ): AxiosPromise {
    return axios({
      ...config,
      method: 'GET',
      url: `/logout`
    })
  }
}