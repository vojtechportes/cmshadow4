import axios, { AxiosPromise } from 'axios'
import { RequestConfig } from './requestConfig'
import { TemplatePage } from 'model/api/TemplatePage'
import { PaginatedList } from 'model/api/PaginatedList'

export class TemplatePagesApi {
  /**
   * Get Template Pages
   *
   * @param page
   * @param pageSize
   */
  static getTemplatePages(
    page?: number,
    pageSize?: number,
    config?: RequestConfig
  ): AxiosPromise<PaginatedList<TemplatePage>> {
    return axios({
      ...config,
      method: 'GET',
      url: `/template-pages`,
      params: {
        page,
        per_page: pageSize,
      },
    })
  }

  /**
   * Get Template Pages
   *
   * @param layout_id
   */
  static getAllTemplatePages(
    layout_id?: number,
    config?: RequestConfig
  ): AxiosPromise<TemplatePage[]> {
    return axios({
      ...config,
      method: 'GET',
      url: `/template-pages/all`,
      params: {
        layout_id,
      },
    })
  }

  /**
   * Get Template Page
   *
   * @param templatePageId
   */
  static getTemplatePage(
    templatePageId: number,
    config?: RequestConfig
  ): AxiosPromise<TemplatePage> {
    return axios({
      ...config,
      method: 'GET',
      url: `/template-pages/${templatePageId}`,
    })
  }

  /**
   * Create Template Page
   */
  static createTemplatePage(
    data: FormData,
    config?: RequestConfig
  ): AxiosPromise<{ id: number }> {
    return axios({
      ...config,
      method: 'POST',
      url: `/template-pages`,
      data,
    })
  }

  /**
   * Update Template Page
   */
  static updateTemplatePage(
    templatePageId: number,
    data: FormData,
    config?: RequestConfig
  ): AxiosPromise {
    return axios({
      ...config,
      method: 'PUT',
      url: `/template-pages/${templatePageId}`,
      data,
    })
  }

  /**
   * Delete Template Page
   */
  static deleteTemplatePage(
    templatePageId: number,
    config?: RequestConfig
  ): AxiosPromise {
    return axios({
      ...config,
      method: 'DELETE',
      url: `/template-pages/${templatePageId}`,
    })
  }
}
