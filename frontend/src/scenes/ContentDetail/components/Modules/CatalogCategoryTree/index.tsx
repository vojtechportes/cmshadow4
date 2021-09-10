import React, { useContext, useCallback, useState, useEffect } from 'react'
import {
  ModuleProps,
  CatalogCategoryTreeDataProps,
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
import { CatalogCategory } from 'model/api/CatalogCategory'

export interface CatalogCategoryTreeProps extends ModuleProps {
  onMove?: OnMove
  data: CatalogCategoryTreeDataProps
}

export const CatalogCategoryTree: React.FC<CatalogCategoryTreeProps> = ({
  uuid,
  isNew,
  moduleId,
  moduleType,
  data: {
    parent_category_id,
    display_if_parent_category_id,
    language_code,
    link_pattern,
  },
  onMove,
  slotId,
  locked,
}) => {
  const { t } = useTranslation('content-detail')
  const { view } = useContext(ContentDetailContext)
  const [catalogCategories, setCatalogCategories] = useState<
    CatalogCategory[]
  >()
  const [isConfigurationOpen, setIsConfigurationOpen] = useState(false)
  const { getTemplatePreview } = useGetTemplatePreview()
  const { drag, drop, isDragging, ref } = useModuleSort({
    uuid,
    slotId,
    onMove,
    locked,
  })
  const { update } = useModuleUpdate<CatalogCategoryTreeDataProps>({
    uuid,
    slotId,
  })
  const handleDelete = useDeleteModule({ isNew, slotId, uuid, moduleId })

  const templatePreview =
    view && getTemplatePreview(view.path, ModuleTypeEnum.CATALOG_CATEGORY_TREE)

  const handleConfigurationChange = useCallback(
    ({
      parent_category_id,
      display_if_parent_category_id,
      language_code,
      link_pattern,
    }: Data) => {
      update(
        {
          parent_category_id,
          display_if_parent_category_id,
          language_code,
          link_pattern,
        },
        true
      )
      setIsConfigurationOpen(false)
    },
    [update]
  )

  const getCatalogCategories = useCallback(
    async (cancelToken: CancelToken) => {
      const { data } = await CatalogCategoriesApi.getCatalogCategories(
        parent_category_id ? parent_category_id : undefined,
        true,
        true,
        language_code,
        {
          cancelToken,
        }
      )

      setCatalogCategories(data)
    },
    [parent_category_id, language_code]
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
            <JSXParser
              jsx={templatePreview.template}
              bindings={{
                items: catalogCategories,
                link_pattern,
              }}
              renderInWrapper={false}
            />
          </Container>
        </div>
        {isConfigurationOpen && (
          <Configuration
            data={{
              parent_category_id,
              display_if_parent_category_id,
              language_code,
              link_pattern,
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
