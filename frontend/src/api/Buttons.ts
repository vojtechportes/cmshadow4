import axios, { AxiosPromise } from 'axios'
import { RequestConfig } from './requestConfig'
import { Button } from 'model/api/Button'
import { PaginatedList } from 'model/api/PaginatedList'

export class ButtonsApi {
  /**
   * Get Buttons
   *
   * @param page
   * @param pageSize
   */
  static getButtons(
    page?: number,
    pageSize?: number,
    config?: RequestConfig
  ): AxiosPromise<PaginatedList<Button>> {
    return axios({
      ...config,
      method: 'GET',
      url: `/buttons`,
      params: {
        page,
        per_page: pageSize
      },
    })
  }

  /**
   * Get All Buttons
   *
   */
  static getAllButtons(
    config?: RequestConfig
  ): AxiosPromise<Button[]> {
    return axios({
      ...config,
      method: 'GET',
      url: `/buttons/all`,
    })
  }

  /**
   * Get Button
   *
   * @param buttonId
   */
  static getButton(
    buttonId: number,
    config?: RequestConfig
  ): AxiosPromise<Button> {
    return axios({
      ...config,
      method: 'GET',
      url: `/buttons/${buttonId}`,
    })
  }

  /**
   * Create Button
   *
   * @param data
   */
  static createButton(
    data: FormData,
    config?: RequestConfig
  ): AxiosPromise<{ id: number }> {
    return axios({
      ...config,
      method: 'POST',
      url: `/buttons`,
      data
    })
  }

  /**
   * Update Button
   *
   * @param buttonId
   * @param data
   */
  static updateButton(
    buttonId: number,
    data: FormData,
    config?: RequestConfig
  ): AxiosPromise {
    return axios({
      ...config,
      method: 'PUT',
      url: `/buttons/${buttonId}`,
      data
    })
  }

  /**
   * Delete Button
   *
   * @param buttonId
   */
  static deleteButton(
    buttonId: number,
    config?: RequestConfig
  ): AxiosPromise {
    return axios({
      ...config,
      method: 'DELETE',
      url: `/buttons/${buttonId}`,
    })
  }
}