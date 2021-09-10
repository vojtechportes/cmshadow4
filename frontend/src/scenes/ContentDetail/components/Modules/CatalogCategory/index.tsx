import React, { useContext, useCallback, useState, useEffect } from 'react'
import {
  ModuleProps,
  CatalogCategoryDataProps,
} from 'scenes/ContentDetail/types/Module'
import { Container } from '../styles'
import { ContentDetailContext } from 'scenes/ContentDetail'
import { JSXParser } from 'components/JSXParser'
import { Controls } from '../Controls'
import { useModuleSort } from 'scenes/ContentDetail/hooks/useModuleSort'
import { OnMove } from 'scenes/ContentDetail/types/OnMove'
import { useModuleUpdate } from 'scenes/ContentDetail/hooks/useModuleUpdate'
import { useGetTemplatePreview } from 'scenes/ContentDetail/hooks/useGetTemplatePreview'
import { useDeleteModule } from 'scenes/ContentDetail/hooks/useDeleteModule'
import axios, { CancelToken } from 'axios'
import { Configuration, Data } from './Configuration'
import { Alert } from 'antd'
import { useTranslation } from 'react-i18next'
import { ModuleTypeEnum } from 'model/api/ModuleTypeEnum'
import { CatalogCategoriesApi } from 'api/CatalogCategories'
import { CatalogCategory as CatalogCategoryInerface } from 'model/api/CatalogCategory'

export interface CatalogCategoryProps extends ModuleProps {
  onMove?: OnMove
  data: CatalogCategoryDataProps
}

export const CatalogCategory: React.FC<CatalogCategoryProps> = ({
  uuid,
  isNew,
  moduleId,
  moduleType,
  data: {
    category_id,
    language_code,
    category_id_variable_name,
    load_from_global_context,
  },
  onMove,
  slotId,
  locked,
}) => {
  const { t } = useTranslation('content-detail')
  const { view } = useContext(ContentDetailContext)
  const [catalogCategory, setCatalogCategory] = useState<
    CatalogCategoryInerface
  >()
  const [isConfigurationOpen, setIsConfigurationOpen] = useState(false)
  const { getTemplatePreview } = useGetTemplatePreview()
  const { drag, drop, isDragging, ref } = useModuleSort({
    uuid,
    slotId,
    onMove,
    locked,
  })
  const { update } = useModuleUpdate<CatalogCategoryDataProps>({
    uuid,
    slotId,
  })
  const handleDelete = useDeleteModule({ isNew, slotId, uuid, moduleId })

  const templatePreview =
    view && getTemplatePreview(view.path, ModuleTypeEnum.CATALOG_CATEGORY)

  const handleConfigurationChange = useCallback(
    ({
      category_id,
      language_code,
      category_id_variable_name,
      load_from_global_context,
    }: Data) => {
      update(
        {
          category_id,
          language_code,
          category_id_variable_name,
          load_from_global_context,
        },
        true
      )
      setIsConfigurationOpen(false)
    },
    [update]
  )

  const getCatalogCategories = useCallback(
    async (cancelToken: CancelToken) => {
      if (category_id) {
        const { data } = await CatalogCategoriesApi.getCatalogCategory(
          category_id,
          true,
          {
            cancelToken,
          }
        )

        setCatalogCategory(data)
      }
    },
    [category_id]
  )

  useEffect(() => {
    const cancelTokenSource = axios.CancelToken.source()

    getCatalogCategories(cancelTokenSource.token)

    return () => cancelTokenSource.cancel()
  }, [getCatalogCategories])

  if (templatePreview) {
    const opacity = isDragging ? 0 : 1
    drag(drop(ref))

    return (
      <>
        <div ref={ref} style={{ opacity }}>
          <Container locked={locked}>
            {!locked && (
              <Controls
                moduleType={moduleType}
                hasEdit={false}
                onConfigure={() => setIsConfigurationOpen(true)}
                onDelete={handleDelete}
              />
            )}
            {!!catalogCategory ||
            category_id_variable_name ||
            load_from_global_context ? (
              <JSXParser
                jsx={templatePreview.template}
                bindings={{
                  data: catalogCategory,
                  language_code,
                  category_id_variable_name,
                  load_from_global_context,
                }}
                renderInWrapper={false}
              />
            ) : (
              <Alert
                message={t('this-module-needs-to-be-configured-first')}
                type="info"
              />
            )}
          </Container>
        </div>
        {isConfigurationOpen && (
          <Configuration
            data={{
              category_id,
              language_code,
              category_id_variable_name,
              load_from_global_context,
            }}
            onConfirm={handleConfigurationChange}
            onCancel={() => setIsConfigurationOpen(false)}
          />
        )}
      </>
    )
  }

  return (
    <Alert
      message={t('this-module-needs-to-be-configured-first')}
      type="info"
    />
  )
}
