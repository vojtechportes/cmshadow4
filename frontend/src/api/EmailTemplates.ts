import axios, { AxiosPromise } from 'axios'
import { RequestConfig } from './requestConfig'
import { EmailTemplate } from 'model/api/EmailTemplate'
import { PaginatedList } from 'model/api/PaginatedList'

export class EmailTemplatesApi {
  /**
   * Get Email templates
   *
   * @param page
   * @param pageSize
   */
  static getEmailTemplates(
    page?: number,
    pageSize?: number,
    config?: RequestConfig
  ): AxiosPromise<PaginatedList<EmailTemplate>> {
    return axios({
      ...config,
      method: 'GET',
      url: `/email-templates`,
      params: {
        page,
        per_page: pageSize
      },
    })
  }

  /**
   * Get Email Template
   *
   * @param emailTemplateId
   */
  static getEmailTemplate(
    emailTemplateId: number,
    config?: RequestConfig
  ): AxiosPromise<EmailTemplate> {
    return axios({
      ...config,
      method: 'GET',
      url: `/email-templates/${emailTemplateId}`,
    })
  }

  /**
   * Create Email template
   *
   * @param data
   */
  static createEmailTemplate(
    data: FormData,
    config?: RequestConfig
  ): AxiosPromise<{ id: number }> {
    return axios({
      ...config,
      method: 'POST',
      url: `/email-templates`,
      data
    })
  }

  /**
   * Update Email template
   *
   * @param emailTemplateId
   * @param data
   */
  static updateEmailTemplate(
    emailTemplateId: number,
    data: FormData,
    config?: RequestConfig
  ): AxiosPromise {
    return axios({
      ...config,
      method: 'PUT',
      url: `/email-templates/${emailTemplateId}`,
      data
    })
  }

  /**
   * Delete Email template
   *
   * @param emailTemplateId
   */
  static deleteEmailTemplate(
    emailTemplateId: number,
    config?: RequestConfig
  ): AxiosPromise {
    return axios({
      ...config,
      method: 'DELETE',
      url: `/email-templates/${emailTemplateId}`,
    })
  }
}