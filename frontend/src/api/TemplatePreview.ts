import axios, { AxiosPromise } from 'axios'
import { RequestConfig } from './requestConfig'
import { TemplatePreview } from 'model/api/TemplatePreview'

export class TemplatePreviewApi {
  /**
   * Get Template Preview
   *
   * @param viewName
   * @param templateName
   */
  static getTemplatePreview(
    viewName: string,
    templateName: string,
    config?: RequestConfig
  ): AxiosPromise<TemplatePreview> {
    return axios({
      ...config,
      method: 'GET',
      url: `/template-preview`,
      params: {
        view_name: viewName,
        template_name: templateName,
      },
    })
  }
}