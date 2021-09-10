import axios, { AxiosPromise } from 'axios'
import { RequestConfig } from './requestConfig'
import { Navigation } from 'model/api/Navigation'
import { PaginatedList } from 'model/api/PaginatedList'
import { NavigationDetail } from 'model/api/NavigationDetail'

export class NavigationsApi {
  /**
   * Get Navigations
   *
   * @param page
   * @param pageSize
   */
  static getNavigations(
    page?: number,
    pageSize?: number,
    config?: RequestConfig
  ): AxiosPromise<PaginatedList<Navigation>> {
    return axios({
      ...config,
      method: 'GET',
      url: `/navigations`,
      params: {
        page,
        per_page: pageSize
      },
    })
  }

  /**
   * Get All Navigations
   *
   */
  static getAllNavigations(
    config?: RequestConfig
  ): AxiosPromise<Navigation[]> {
    return axios({
      ...config,
      method: 'GET',
      url: `/navigations/all`,
    })
  }

  /**
   * Get Navigation
   *
   * @param navigationId
   */
  static getNavigation(
    navigationId: number,
    config?: RequestConfig
  ): AxiosPromise<NavigationDetail> {
    return axios({
      ...config,
      method: 'GET',
      url: `/navigations/${navigationId}`,
    })
  }

  /**
   * Create Navigation
   *
   * @param data
   */
  static createNavigation(
    data: FormData,
    config?: RequestConfig
  ): AxiosPromise<{ id: number }> {
    return axios({
      ...config,
      method: 'POST',
      url: `/navigations`,
      data
    })
  }

  /**
   * Update Navigation
   *
   * @param navigationId
   * @param data
   */
  static updateNavigation(
    navigationId: number,
    data: FormData,
    config?: RequestConfig
  ): AxiosPromise {
    return axios({
      ...config,
      method: 'PUT',
      url: `/navigations/${navigationId}`,
      data
    })
  }

  /**
   * Delete Navigation
   *
   * @param navigationId
   */
  static deleteNavigation(
    navigationId: number,
    config?: RequestConfig
  ): AxiosPromise {
    return axios({
      ...config,
      method: 'DELETE',
      url: `/navigations/${navigationId}`,
    })
  }
}