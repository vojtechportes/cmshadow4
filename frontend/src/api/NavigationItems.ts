import axios, { AxiosPromise } from 'axios'
import { RequestConfig } from './requestConfig'
import { NavigationItem } from 'model/api/NavigationItem'

export class NavigationsItemsApi {
  /**
   * Get Navigation Item
   *
   * @param navigationId
   * @param navigationItemId
   */
  static getNavigationItem(
    navigationId: number,
    navigationItemId: number,
    config?: RequestConfig
  ): AxiosPromise<NavigationItem> {
    return axios({
      ...config,
      method: 'GET',
      url: `/navigations/${navigationId}/items/${navigationItemId}`,
    })
  }

  /**
   * Create Navigation Item
   *
   * @param navigationId
   * @param data
   */
  static createNavigationItem(
    navigationId: number,
    data: FormData,
    config?: RequestConfig
  ): AxiosPromise<{ id: number }> {
    return axios({
      ...config,
      method: 'POST',
      url: `/navigations/${navigationId}/items`,
      data,
    })
  }

  /**
   * Update Navigation Item
   *
   * @param navigationId
   * @param navigationItemId
   * @param data
   */
  static updateNavigationItem(
    navigationId: number,
    navigationItemId: number,
    data: FormData,
    config?: RequestConfig
  ): AxiosPromise {
    return axios({
      ...config,
      method: 'PUT',
      url: `/navigations/${navigationId}/items/${navigationItemId}`,
      data,
    })
  }

  /**
   * Delete Navigation
   *
   * @param navigationId
   * @param navigationItemId
   */
  static deleteNavigationItem(
    navigationId: number,
    navigationItemId: number,
    config?: RequestConfig
  ): AxiosPromise {
    return axios({
      ...config,
      method: 'DELETE',
      url: `/navigations/${navigationId}/items/${navigationItemId}`,
    })
  }
}
