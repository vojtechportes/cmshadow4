import axios, { AxiosPromise } from 'axios'
import { RequestConfig } from './requestConfig'
import { View } from 'model/api/View'
import { PaginatedList } from 'model/api/PaginatedList'

export class ViewsApi {
  /**
   * Get Views
   *
   * @param page
   * @param pageSize
   */
  static getViews(
    page?: number,
    pageSize?: number,
    config?: RequestConfig
  ): AxiosPromise<PaginatedList<View>> {
    return axios({
      ...config,
      method: 'GET',
      url: `/views`,
      params: {
        page,
        per_page: pageSize
      },
    })
  }

  /**
   * Get All Views
   *
   */
  static getAllViews(
    config?: RequestConfig
  ): AxiosPromise<View[]> {
    return axios({
      ...config,
      method: 'GET',
      url: `/views/all`,
    })
  }

  /**
   * Get View
   *
   * @param viewId
   */
  static getView(
    viewId: number,
    config?: RequestConfig
  ): AxiosPromise<View> {
    return axios({
      ...config,
      method: 'GET',
      url: `/views/${viewId}`,
    })
  }

  /**
   * Create View
   *
   * @param data
   */
  static createView(
    data: FormData,
    config?: RequestConfig
  ): AxiosPromise<{ id: number }> {
    return axios({
      ...config,
      method: 'POST',
      url: `/views`,
      data
    })
  }

  /**
   * Update View
   *
   * @param viewId
   * @param data
   */
  static updateView(
    viewId: number,
    data: FormData,
    config?: RequestConfig
  ): AxiosPromise {
    return axios({
      ...config,
      method: 'PUT',
      url: `/views/${viewId}`,
      data
    })
  }

  /**
   * Delete View
   *
   * @param viewId
   */
  static deleteView(
    viewId: number,
    config?: RequestConfig
  ): AxiosPromise {
    return axios({
      ...config,
      method: 'DELETE',
      url: `/views/${viewId}`,
    })
  }
}