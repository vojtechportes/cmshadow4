import axios, { AxiosPromise } from 'axios'
import { RequestConfig } from './requestConfig'
import { Template } from 'model/api/Template'
import { PaginatedList } from 'model/api/PaginatedList'
import { TemplateDetail } from 'model/api/TemplateDetail'

export class TemplatesApi {
  /**
   * Get Templates
   *
   * @param page
   * @param pageSize
   */
  static getTemplates(
    page?: number,
    pageSize?: number,
    config?: RequestConfig
  ): AxiosPromise<PaginatedList<Template>> {
    return axios({
      ...config,
      method: 'GET',
      url: `/templates`,
      params: {
        page,
        per_page: pageSize,
      },
    })
  }

  /**
   * Get All Templates
   */
  static getAllTemplates(
    config?: RequestConfig
  ): AxiosPromise<Template[]> {
    return axios({
      ...config,
      method: 'GET',
      url: `/templates/all`,
    })
  }

  /**
   * Get Template
   *
   * @param templateId
   */
  static getTemplate(
    templateId: number,
    config?: RequestConfig
  ): AxiosPromise<TemplateDetail> {
    return axios({
      ...config,
      method: 'GET',
      url: `/templates/${templateId}`,
    })
  }

  /**
   * Create Template
   */
  static createTemplate(
    data: FormData,
    config?: RequestConfig
  ): AxiosPromise<{ id: number }> {
    return axios({
      ...config,
      method: 'POST',
      url: `/templates`,
      data,
    })
  }

  /**
   * Update Template
   */
  static updateTemplate(
    templateId: number,
    data: FormData,
    config?: RequestConfig
  ): AxiosPromise {
    return axios({
      ...config,
      method: 'PUT',
      url: `/templates/${templateId}`,
      data,
    })
  }

  /**
   * Delete Template
   */
  static deleteTemplate(
    templateId: number,
    config?: RequestConfig
  ): AxiosPromise {
    return axios({
      ...config,
      method: 'DELETE',
      url: `/templates/${templateId}`,
    })
  }
}
