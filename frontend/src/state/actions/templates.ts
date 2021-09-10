import { createAction } from 'redux-actions'
import { TemplatePreview } from 'model/api/TemplatePreview'
import { ThunkDispatch } from 'redux-thunk'
import { State } from 'state/rootReducer'
import { AnyAction } from 'redux'
import { ViewsApi } from 'api/Views'
import { TemplatePreviewApi } from 'api/TemplatePreview'
import { ModuleTypeEnum } from 'model/api/ModuleTypeEnum'
import { CatalogItemTemplatesApi } from 'api/CatalogItemTemplates'
import { NavigationsApi } from 'api/Navigations'

export interface SetTemplatePreviewPayload {
  data: TemplatePreview
  moduleName: string
  path: string
}

export const SET_TEMPLATE_PREVIEW = 'SET_TEMPLATE_PREVIEW'
export const CLEAR_TEMPLATE_PREVIEWS = 'CLEAR_TEMPLATE_PREVIEWS'

export const setTemplatePreview = createAction<SetTemplatePreviewPayload>(
  SET_TEMPLATE_PREVIEW
)

export const clearTemplatePreviews = createAction(CLEAR_TEMPLATE_PREVIEWS)

export const fetchTemplatePreviews = () => async (
  dispatch: ThunkDispatch<State, void, AnyAction>,
  getState: () => State
) => {
  const {
    templates: { previews },
  } = getState()

  const { data: views } = await ViewsApi.getAllViews()
  const {
    data: catalogViews,
  } = await CatalogItemTemplatesApi.getAllCatalogItemTemplates()

  const { data: navigations } = await NavigationsApi.getAllNavigations()

  catalogViews.forEach(({ path, view_id }) => {
    const { path: viewPath } = views.find(item => item.id === view_id)
    const catalogViewPath = `${viewPath}`
    const nameListing = path
    const nameDetail = `${path}_detail`

    /**
     * Listing view
     */
    if (!previews[catalogViewPath] || !previews[catalogViewPath][nameListing]) {
      /**
       * Using promise instead of await/async to lower chance of blocking other
       * requests
       */
      TemplatePreviewApi.getTemplatePreview(catalogViewPath, nameListing)
        .then(({ data: templatePreviewData }) => {
          dispatch(
            setTemplatePreview({
              path: catalogViewPath,
              moduleName: nameListing,
              data: templatePreviewData,
            })
          )
        })
        .catch(() => {
          //
        })
    }

    /**
     * Detail view
     */
    if (!previews[catalogViewPath] || !previews[catalogViewPath][nameDetail]) {

      /**
       * Using promise instead of await/async to lower chance of blocking other
       * requests
       */
      TemplatePreviewApi.getTemplatePreview(catalogViewPath, nameDetail)
        .then(({ data: templatePreviewData }) => {
          dispatch(
            setTemplatePreview({
              path: catalogViewPath,
              moduleName: nameDetail,
              data: templatePreviewData,
            })
          )
        })
        .catch(() => {
          //
        })
    }
  })

  views.forEach(({ path }) => {
    Object.keys(ModuleTypeEnum).forEach(moduleName => {
      /**
       * Load templates for navigation modules separately. Navigation bodules
       * has defined its own subfolder
       */
      if (moduleName === ModuleTypeEnum.NAVIGATION) {
        /**
         * Using promise instead of await/async to lower chance of blocking other
         * requests
         */
        navigations.forEach(({ path: navigationPath }) => {
          const currentPath = `${path}/${navigationPath}`

          if (!previews[currentPath] || !previews[currentPath][moduleName]) {
            TemplatePreviewApi.getTemplatePreview(
              currentPath,
              moduleName.toLowerCase()
            )
              .then(({ data: templatePreviewData }) => {
                dispatch(
                  setTemplatePreview({
                    path: currentPath,
                    moduleName,
                    data: templatePreviewData,
                  })
                )
              })
              .catch(() => {
                //
              })
          }
        })
      } else {
        if (!previews[path] || !previews[path][moduleName]) {
          /**
           * Using promise instead of await/async to lower chance of blocking other
           * requests
           */
          TemplatePreviewApi.getTemplatePreview(path, moduleName.toLowerCase())
            .then(({ data: templatePreviewData }) => {
              dispatch(
                setTemplatePreview({
                  path,
                  moduleName,
                  data: templatePreviewData,
                })
              )
            })
            .catch(() => {
              //
            })
        }
      }
    })
  })
}
