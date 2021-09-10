import axios, { AxiosPromise } from 'axios'
import { RequestConfig } from './requestConfig'
import { Layout } from 'model/api/Layout'
import { PaginatedList } from 'model/api/PaginatedList'

export class LayoutsApi {
  /**
   * Get Layouts
   *
   * @param page
   * @param pageSize
   */
  static getLayouts(
    page?: number,
    pageSize?: number,
    config?: RequestConfig
  ): AxiosPromise<PaginatedList<Layout>> {
    return axios({
      ...config,
      method: 'GET',
      url: `/layouts`,
      params: {
        page,
        per_page: pageSize
      },
    })
  }

  /**
   * Get All Layouts
   *
   */
  static getAllLayouts(
    config?: RequestConfig
  ): AxiosPromise<Layout[]> {
    return axios({
      ...config,
      method: 'GET',
      url: `/layouts/all`,
    })
  }

  /**
   * Get Layout
   *
   * @param layoutId
   */
  static getLayout(
    layoutId: number,
    config?: RequestConfig
  ): AxiosPromise<Layout> {
    return axios({
      ...config,
      method: 'GET',
      url: `/layouts/${layoutId}`,
    })
  }

  /**
   * Create Layout
   *
   * @param data
   */
  static createLayout(
    data: FormData,
    config?: RequestConfig
  ): AxiosPromise<{ id: number }> {
    return axios({
      ...config,
      method: 'POST',
      url: `/layouts`,
      data
    })
  }

  /**
   * Update Layout
   *
   * @param layoutId
   */
  static updateLayout(
    layoutId: number,
    data: FormData,
    config?: RequestConfig
  ): AxiosPromise {
    return axios({
      ...config,
      method: 'PUT',
      url: `/layouts/${layoutId}`,
      data
    })
  }

  /**
   * Delete Layout
   *
   * @param layoutId
   */
  static deleteLayout(
    layoutId: number,
    config?: RequestConfig
  ): AxiosPromise {
    return axios({
      ...config,
      method: 'DELETE',
      url: `/layouts/${layoutId}`,
    })
  }
}