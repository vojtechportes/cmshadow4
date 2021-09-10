import axios, { AxiosPromise } from 'axios'
import { RequestConfig } from './requestConfig'
import { PaginatedList } from 'model/api/PaginatedList'
import { Page } from 'model/api/Page'

export class PagesApi {
  /**
   * Get Pages
   *
   * @param parent
   * @param page
   * @param pageSize
   */
  static getPages(
    parent?: string,
    page?: number,
    pageSize?: number,
    config?: RequestConfig
  ): AxiosPromise<PaginatedList<Page>> {
    return axios({
      ...config,
      method: 'GET',
      url: `/pages`,
      params: {
        parent,
        page,
        per_page: pageSize
      },
    })
  }

  /**
   * Get All Pages
   */
  static getAllPages(
    config?: RequestConfig
  ): AxiosPromise<Page[]> {
    return axios({
      ...config,
      method: 'GET',
      url: `/pages/all`,
    })
  }

  /**
   * Get Page
   *
   */
  static getPage(
    identifier: string,
    config?: RequestConfig
  ): AxiosPromise<Page> {
    return axios({
      ...config,
      method: 'GET',
      url: `/pages/${identifier}`,
    })
  }

  /**
   * Create Page
   *
   * @param data
   */
  static createPage(
    data: FormData,
    config?: RequestConfig
  ): AxiosPromise<{ identifier: string }> {
    return axios({
      ...config,
      method: 'POST',
      url: `/pages`,
      data
    })
  }

  /**
   * Update Page
   *
   * @param identifier
   * @param data
   */
  static updatePage(
    identifier: string,
    data: FormData,
    config?: RequestConfig
  ): AxiosPromise<{ identifier: string, version: number }> {
    return axios({
      ...config,
      method: 'PUT',
      url: `/pages/${identifier}`,
      data
    })
  }

  /**
   * Update Page
   *
   * @param data
   */
  static setPageModules(
    identifier: string,
    data: FormData,
    config?: RequestConfig,
  ): AxiosPromise {

    return axios({
      ...config,
      method: 'PUT',
      url: `/pages/${identifier}/modules`,
      data,
    })
  }

  /**
   * Get Page Versions
   *
   * @param page
   * @param pageSize
   * @param identifier
   */
  static getPageVersions(
    identifier: string,
    page?: number,
    pageSize?: number,
    config?: RequestConfig
  ): AxiosPromise {
    return axios({
      ...config,
      method: 'GET',
      url: `/pages/${identifier}/versions`,
      params: {
        page,
        per_page: pageSize
      },
    })
  }

  /**
   * Publish Page
   *
   * @param identifier
   */
  static publishPage(
    identifier: string,
    config?: RequestConfig
  ): AxiosPromise {
    return axios({
      ...config,
      method: 'PUT',
      url: `/pages/${identifier}/publish`,
    })
  }

  /**
   * Unpublish Page
   *
   * @param identifier
   */
  static unpublishPage(
    identifier: string,
    config?: RequestConfig
  ): AxiosPromise {
    return axios({
      ...config,
      method: 'PUT',
      url: `/pages/${identifier}/unpublish`,
    })
  }

  /**
   * Delete Page
   *
   * @param identifier
   */
  static deletePage(
    identifier: string,
    config?: RequestConfig
  ): AxiosPromise {
    return axios({
      ...config,
      method: 'DELETE',
      url: `/pages/${identifier}/delete`,
    })
  }

  /**
   * Revert Page to Version
   *
   * @param identifier
   * @param version
   */
  static revertPage(
    identifier: string,
    version: number,
    config?: RequestConfig
  ): AxiosPromise {
    return axios({
      ...config,
      method: 'DELETE',
      url: `/pages/${identifier}/revert/${version}`,
    })
  }
}