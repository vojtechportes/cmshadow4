import axios, { AxiosPromise } from 'axios'
import { RequestConfig } from './requestConfig'
import { CatalogItemTemplateField } from 'model/api/CatalogItemTemplateField'
import { PaginatedList } from 'model/api/PaginatedList'

export class CatalogItemTemplateFieldsApi {
  /**
   * Get Catalog Item Template Fields
   *
   * @param catalogItemTemplateId
   * @param page
   * @param pageSize
   */
  static getCatalogItemTemplateFields(
    catalogItemTemplateId: number,
    page?: number,
    pageSize?: number,
    config?: RequestConfig
  ): AxiosPromise<PaginatedList<CatalogItemTemplateField>> {
    return axios({
      ...config,
      method: 'GET',
      url: `/catalog-item-templates/${catalogItemTemplateId}/fields`,
      params: {
        page,
        per_page: pageSize,
      },
    })
  }

  /**
   * Get Catalog Item Template Field
   *
   * @param catalogItemTemplateId
   * @param catalogItemTemplateFieldId
   */
  static getCatalogItemTemplateField(
    catalogItemTemplateId: number,
    catalogItemTemplateFieldId: number,
    config?: RequestConfig
  ): AxiosPromise<CatalogItemTemplateField> {
    return axios({
      ...config,
      method: 'GET',
      url: `/catalog-item-templates/${catalogItemTemplateId}/fields/${catalogItemTemplateFieldId}`,
    })
  }

  /**
   * Create Catalog Item Template Field
   *
   * @param catalogItemTemplateId
   * @param data
   */
  static createCatalogItemTemplateField(
    catalogItemTemplateId: number,
    data: FormData,
    config?: RequestConfig
  ): AxiosPromise<CatalogItemTemplateField> {
    return axios({
      ...config,
      method: 'POST',
      url: `/catalog-item-templates/${catalogItemTemplateId}/fields`,
      data,
    })
  }

  /**
   * Update Catalog Item Template Field
   *
   * @param catalogItemTemplateId
   * @param catalogItemTemplateFieldId
   * @param data
   */
  static updateCatalogItemTemplateField(
    catalogItemTemplateId: number,
    catalogItemTemplateFieldId: number,
    data: FormData,
    config?: RequestConfig
  ): AxiosPromise {
    return axios({
      ...config,
      method: 'PUT',
      url: `/catalog-item-templates/${catalogItemTemplateId}/fields/${catalogItemTemplateFieldId}`,
      data,
    })
  }

  /**
   * Create Catalog Item Template Field
   *
   * @param catalogItemTemplateId
   * @param catalogItemTemplateFieldId
   */
  static deleteCatalogItemTemplateField(
    catalogItemTemplateId: number,
    catalogItemTemplateFieldId: number,
    config?: RequestConfig
  ): AxiosPromise {
    return axios({
      ...config,
      method: 'DELETE',
      url: `/catalog-item-templates/${catalogItemTemplateId}/fields/${catalogItemTemplateFieldId}`,
    })
  }
}
