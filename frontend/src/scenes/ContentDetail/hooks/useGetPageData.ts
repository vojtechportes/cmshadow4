import { useCallback, useState, useRef, useEffect } from 'react'
import { Page } from 'model/api/Page'
import { LayoutSlot } from 'model/api/LayoutSlot'
import { View } from 'model/api/View'
import { Template } from 'model/api/Template'
import { Layout } from 'model/api/Layout'
import axios, { CancelTokenSource } from 'axios'
import { TemplatesApi } from 'api/Templates'
import { PagesApi } from 'api/Pages'
import { ViewsApi } from 'api/Views'
import { LayoutsApi } from 'api/Layouts'
import { LayoutSlotsApi } from 'api/LayoutSlots'
import { ModulesApi } from 'api/Modules'
import { ModuleProps } from '../types/Module'
import uuid from 'uuid/v4'
import { ModuleTypeEnum } from 'model/api/ModuleTypeEnum'
import { TextModulesApi } from 'api/TextModules'
import { CatalogListingModulesApi } from 'api/CatalogListingModules'
import { NavigationModulesApi } from 'api/NavigationModules'
import { ButtonModulesApi } from 'api/ButtonModules'
import { ImageModulesApi } from 'api/ImageModules'
import { HeadingModulesApi } from 'api/HeadingModules'
import { CatalogItemModulesApi } from 'api/CatalogItemModules'
import { CatalogCategoryTreeModulesApi } from 'api/CatalogCategoryTreeModules'
import { CatalogCategoryModulesApi } from 'api/CatalogCategoryModules'
import { CatalogDetailModulesApi } from 'api/CatalogDetailModules'
import { CatalogSearchModulesApi } from 'api/CatalogSearchModules'
import { HtmlModulesApi } from 'api/HtmlModules'
import { PageTypeEnum } from 'model/api/PageTypeEnum'
import { asyncForEach } from 'utils/asyncForEach'

export interface ModulesProps {
  [slotId: number]: ModuleProps[]
}

export interface UseGetPageDataProps {
  view: 'new' | 'detail'
  identifier?: string
}

export interface UseGetPageDataResponseProps {
  loading: boolean
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
  page?: Page
  template?: Template
  view?: View
  layout?: Layout
  layoutSlots?: LayoutSlot[]
  modules: ModulesProps
  setModules: React.Dispatch<React.SetStateAction<ModulesProps>>
}

export const useGetPageData = ({
  view,
  identifier,
}: UseGetPageDataProps): UseGetPageDataResponseProps => {
  const cancelTokenSourceRef = useRef<CancelTokenSource>(
    axios.CancelToken.source()
  )

  const [loading, setLoading] = useState(false)
  const [layoutSlots, setLayoutSlots] = useState<LayoutSlot[]>()
  const [page, setPage] = useState<Page>()
  const [template, setTemplate] = useState<Template>()
  const [templateView, setTemplateView] = useState<View>()
  const [layout, setLayout] = useState<Layout>()
  const [modules, setModules] = useState<ModulesProps>({})

  const getLayoutSlots = useCallback(
    async (layoutId: number) => {
      if (view === 'detail' && identifier) {
        try {
          setLoading(true)

          const { data } = await LayoutSlotsApi.getLayoutSlots(layoutId, {
            cancelToken: cancelTokenSourceRef.current.token,
          })

          setLayoutSlots(data)
          setLoading(false)
        } catch (e) {
          setLoading(false)
        }
      }
    },
    [identifier, view]
  )

  const getLayout = useCallback(
    async (layoutId: number) => {
      if (view === 'detail' && identifier) {
        try {
          setLoading(true)

          const { data } = await LayoutsApi.getLayout(layoutId, {
            cancelToken: cancelTokenSourceRef.current.token,
          })

          setLayout(data)
          setLoading(false)
        } catch (e) {
          setLoading(false)
        }
      }
    },
    [identifier, view]
  )

  const getView = useCallback(
    async (viewId: number) => {
      if (view === 'detail' && identifier) {
        try {
          setLoading(true)

          const { data } = await ViewsApi.getView(viewId, {
            cancelToken: cancelTokenSourceRef.current.token,
          })

          setTemplateView(data)
          setLoading(false)
        } catch (e) {
          setLoading(false)
        }
      }
    },
    [identifier, view]
  )

  const getModules = useCallback(
    async (
      identifier: string,
      version: number,
      layoutId: number,
      templatePageIDs: number[]
    ) => {
      setLoading(true)

      const { data } = await ModulesApi.getModules(
        identifier,
        version,
        layoutId,
        templatePageIDs,
        {
          cancelToken: cancelTokenSourceRef.current.token,
        }
      )

      const currentValues = {}

      /*
      TODO: rewrite to synchronous loop to avoid wrong order of modules
      */

      const slotIndex: { [key: number]: number } = {}

      const sortModules = async () => {
        await asyncForEach(data, async currentModule => {
          if (typeof slotIndex[currentModule.slot_id] === 'undefined') {
            slotIndex[currentModule.slot_id] = 0
          } else {
            slotIndex[currentModule.slot_id] =
              slotIndex[currentModule.slot_id] + 1
          }

          console.log(slotIndex[currentModule.slot_id])

          const newModule: ModuleProps = {
            isNew: false,
            isTouched: false,
            moduleType: currentModule.module_type,
            uuid: uuid(),
            slotId: currentModule.slot_id,
            weight: currentModule.weight,
            moduleId: currentModule.id,
            data: {},
            locked: currentModule.page_type === PageTypeEnum.TEMPLATE_PAGE,
            isTemplatePageModule:
              currentModule.page_type === PageTypeEnum.TEMPLATE_PAGE,
          }

          /* eslint-disable no-lone-blocks */
          switch (currentModule.module_type) {
            case ModuleTypeEnum.HEADING:
              {
                try {
                  const {
                    data: moduleData,
                  } = await HeadingModulesApi.getHeadingModule(currentModule.id)

                  newModule.data = {
                    level: moduleData.level,
                    content: moduleData.content,
                  }
                } catch (e) {
                  //
                }
              }
              break
            case ModuleTypeEnum.TEXT:
              {
                try {
                  const {
                    data: moduleData,
                  } = await TextModulesApi.getTextModule(currentModule.id)

                  newModule.data = { content: moduleData.content }
                } catch (e) {
                  //
                }
              }
              break
            case ModuleTypeEnum.HTML:
              {
                try {
                  const {
                    data: moduleData,
                  } = await HtmlModulesApi.getHtmlModule(currentModule.id)

                  newModule.data = { content: moduleData.content }
                } catch (e) {
                  //
                }
              }
              break
            case ModuleTypeEnum.IMAGE:
              {
                try {
                  const {
                    data: moduleData,
                  } = await ImageModulesApi.getImageModule(currentModule.id)

                  newModule.data = {
                    file_name: moduleData.file_name,
                    image_alt: moduleData.image_alt,
                  }
                } catch (e) {
                  //
                }
              }
              break
            case ModuleTypeEnum.BUTTON:
              {
                try {
                  const {
                    data: moduleData,
                  } = await ButtonModulesApi.getButtonModule(currentModule.id)

                  newModule.data = {
                    text: moduleData.text,
                    path: moduleData.path,
                    target: moduleData.target,
                    button_id: moduleData.button_id,
                  }
                } catch (e) {
                  //
                }
              }
              break
            case ModuleTypeEnum.NAVIGATION:
              {
                try {
                  const {
                    data: moduleData,
                  } = await NavigationModulesApi.getNavigationModule(
                    currentModule.id
                  )

                  newModule.data = {
                    navigation_id: moduleData.navigation_id,
                  }
                } catch (e) {
                  //
                }
              }
              break
            case ModuleTypeEnum.CATALOG_LISTING:
              {
                try {
                  const {
                    data: moduleData,
                  } = await CatalogListingModulesApi.getCatalogListingModule(
                    currentModule.id
                  )

                  newModule.data = {
                    language_code: moduleData.language_code,
                    category_id: moduleData.category_id,
                    category_id_variable_name:
                      moduleData.category_id_variable_name,
                  }
                } catch (e) {
                  //
                }
              }
              break
            case ModuleTypeEnum.CATALOG_ITEM:
              {
                try {
                  const {
                    data: moduleData,
                  } = await CatalogItemModulesApi.getCatalogItemModule(
                    currentModule.id
                  )

                  newModule.data = {
                    language_code: moduleData.language_code,
                    catalog_item_id: moduleData.catalog_item_id,
                  }
                } catch (e) {
                  //
                }
              }
              break
            case ModuleTypeEnum.CATALOG_DETAIL:
              {
                try {
                  const {
                    data: moduleData,
                  } = await CatalogDetailModulesApi.getCatalogDetailModule(
                    currentModule.id
                  )

                  newModule.data = {
                    language_code: moduleData.language_code,
                    catalog_item_id: moduleData.catalog_item_id,
                    catalog_item_id_variable_name:
                      moduleData.catalog_item_id_variable_name,
                    load_from_global_context:
                      moduleData.load_from_global_context,
                  }
                } catch (e) {
                  //
                }
              }
              break
            case ModuleTypeEnum.CATALOG_SEARCH:
              {
                try {
                  const {
                    data: moduleData,
                  } = await CatalogSearchModulesApi.getCatalogSearchModule(
                    currentModule.id
                  )

                  newModule.data = {
                    search_placeholder: moduleData.search_placeholder,
                    submit_label: moduleData.submit_label,
                  }
                } catch (e) {
                  //
                }
              }
              break
            case ModuleTypeEnum.CATALOG_CATEGORY_TREE:
              {
                try {
                  const {
                    data: moduleData,
                  } = await CatalogCategoryTreeModulesApi.getCatalogCategoryTreeModule(
                    currentModule.id
                  )

                  newModule.data = {
                    parent_category_id: moduleData.parent_category_id,
                    display_if_parent_category_id:
                      moduleData.display_if_parent_category_id,
                    language_code: moduleData.language_code,
                    link_pattern: moduleData.link_pattern,
                  }
                } catch (e) {
                  //
                }
              }
              break
            case ModuleTypeEnum.CATALOG_CATEGORY:
              {
                try {
                  const {
                    data: moduleData,
                  } = await CatalogCategoryModulesApi.getCatalogCategoryModule(
                    currentModule.id
                  )

                  newModule.data = {
                    category_id: moduleData.category_id,
                    language_code: moduleData.language_code,
                    category_id_variable_name:
                      moduleData.category_id_variable_name,
                    load_from_global_context: !!moduleData.load_from_global_context,
                  }
                } catch (e) {
                  //
                }
              }
              break
          }

          if (!currentValues[currentModule.slot_id]) {
            currentValues[currentModule.slot_id] = []
          }

          currentValues[currentModule.slot_id][
            slotIndex[currentModule.slot_id]
          ] = newModule
        })
      }

      Promise.resolve(
        sortModules().then(() => {
          setModules(currentValues)
          setLoading(false)
        })
      )
    },
    []
  )

  const getTemplate = useCallback(
    async ({ template_id, version }: Page) => {
      if (view === 'detail' && identifier) {
        try {
          setLoading(true)

          const { data } = await TemplatesApi.getTemplate(template_id, {
            cancelToken: cancelTokenSourceRef.current.token,
          })

          const templatePageIDs = []

          data.template_pages.forEach(({ id }) => {
            templatePageIDs.push(id)
          })

          getLayout(data.layout_id)
          getLayoutSlots(data.layout_id)
          getView(data.view_id)
          await getModules(identifier, version, data.layout_id, templatePageIDs)

          setTemplate(data)
          setLoading(false)
        } catch (e) {
          setLoading(false)
        }
      }
    },
    [getLayout, getLayoutSlots, getView, getModules, identifier, view]
  )

  const getPage = useCallback(async () => {
    if (view === 'detail' && identifier) {
      try {
        setLoading(true)

        const { data } = await PagesApi.getPage(identifier, {
          cancelToken: cancelTokenSourceRef.current.token,
        })

        await getTemplate(data)

        setPage(data)
        setLoading(false)
      } catch (e) {
        setLoading(false)
      }
    }
  }, [getTemplate, identifier, view])

  useEffect(() => {
    getPage()
  }, [getPage])

  useEffect(() => {
    const cancelTokenSource = cancelTokenSourceRef.current

    return () => cancelTokenSource.cancel()
  }, [])

  return {
    page,
    template,
    layout,
    layoutSlots,
    view: templateView,
    modules,
    setModules,
    loading,
    setLoading,
  }
}
