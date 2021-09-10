import axios, { AxiosPromise } from 'axios'
import { RequestConfig } from './requestConfig'
import { CatalogItemTemplate } from 'model/api/CatalogItemTemplate'
import { PaginatedList } from 'model/api/PaginatedList'

export class CatalogItemTemplatesApi {
  /**
   * Get Catalog Item Templates
   *
   * @param page
   * @param pageSize
   */
  static getCatalogItemTemplates(
    page?: number,
    pageSize?: number,
    config?: RequestConfig
  ): AxiosPromise<PaginatedList<CatalogItemTemplate>> {
    return axios({
      ...config,
      method: 'GET',
      url: `/catalog-item-templates`,
      params: {
        page,
        per_page: pageSize
      },
    })
  }

  /**
   * Get All Catalog Item Templates
   *
   */
  static getAllCatalogItemTemplates(
    config?: RequestConfig
  ): AxiosPromise<CatalogItemTemplate[]> {
    return axios({
      ...config,
      method: 'GET',
      url: `/catalog-item-templates/all`,
    })
  }

  /**
   * Get Catalog Item Template
   *
   * @param catalogItemTemplateId
   */
  static getCatalogItemTemplate(
    catalogItemTemplateId: number,
    config?: RequestConfig
  ): AxiosPromise<CatalogItemTemplate> {
    return axios({
      ...config,
      method: 'GET',
      url: `/catalog-item-templates/${catalogItemTemplateId}`,
    })
  }  

  /**
   * Creates Catalog Item Template
   *
   * @param data
   */
  static createCatalogItemTemplate(
    data: FormData,
    config?: RequestConfig
  ): AxiosPromise<{ id: number }> {
    return axios({
      ...config,
      method: 'POST',
      url: `/catalog-item-templates`,
      data
    })
  }  

  /**
   * Updates Catalog Item Template
   *
   * @param catalogItemTemplateId
   * @param data
   */
  static updateCatalogItemTemplate(
    catalogItemTemplateId: number,
    data: FormData,
    config?: RequestConfig
  ): AxiosPromise {
    return axios({
      ...config,
      method: 'PUT',
      url: `/catalog-item-templates/${catalogItemTemplateId}`,
      data
    })
  }    


  /**
   * Deletes Catalog Item Template
   *
   * @param catalogItemTemplateId
   */
  static deleteCatalogItemTemplate(
    catalogItemTemplateId: number,
    config?: RequestConfig
  ): AxiosPromise {
    return axios({
      ...config,
      method: 'DELETE',
      url: `/catalog-item-templates/${catalogItemTemplateId}`
    })
  }    
}