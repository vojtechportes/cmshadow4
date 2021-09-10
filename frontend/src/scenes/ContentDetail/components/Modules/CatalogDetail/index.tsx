import React, { useContext, useCallback, useState, useEffect } from 'react'
import {
  ModuleProps,
  CatalogDetailDataProps,
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
import { CatalogItemPublic } from 'model/api/CatalogItemPublic'
import { CatalogItemsApi } from 'api/CatalogItems'
import { TemplatePreview } from 'model/api/TemplatePreview'

export interface CatalogDetailProps extends ModuleProps {
  onMove?: OnMove
  data: CatalogDetailDataProps
}

export const CatalogDetail: React.FC<CatalogDetailProps> = ({
  uuid,
  isNew,
  moduleId,
  moduleType,
  data: {
    catalog_item_id,
    language_code,
    catalog_item_id_variable_name,
    load_from_global_context,
  },
  onMove,
  slotId,
  locked,
}) => {
  const { t } = useTranslation('content-detail')
  const { view } = useContext(ContentDetailContext)
  const [catalogItemDetail, setCatalogItemDetail] = useState<
    CatalogItemPublic
  >()
  const [isConfigurationOpen, setIsConfigurationOpen] = useState(false)
  const { getTemplatePreview } = useGetTemplatePreview()
  const { drag, drop, isDragging, ref } = useModuleSort({
    uuid,
    slotId,
    onMove,
    locked,
  })
  const { update } = useModuleUpdate<CatalogDetailDataProps>({
    uuid,
    slotId,
  })
  const handleDelete = useDeleteModule({ isNew, slotId, uuid, moduleId })
  const [templatePreview, setTemplatePreview] = useState<TemplatePreview>()

  const handleConfigurationChange = useCallback(
    ({
      catalog_item_id,
      language_code,
      catalog_item_id_variable_name,
      load_from_global_context,
    }: Data) => {
      update(
        {
          catalog_item_id,
          language_code,
          catalog_item_id_variable_name,
          load_from_global_context,
        },
        true
      )
      setIsConfigurationOpen(false)
    },
    [update]
  )

  const getCatalogItemDetail = useCallback(
    async (cancelToken: CancelToken) => {
      if (catalog_item_id) {
        try {
          const { data } = await CatalogItemsApi.getPublicCatalogItem(
            catalog_item_id,
            language_code ? language_code : null,
            false,
            {
              cancelToken,
            }
          )

          setCatalogItemDetail(data)
          setTemplatePreview(
            getTemplatePreview(view.path, data.data.template_path)
          )
        } catch (e) {
          setCatalogItemDetail(undefined)
          setTemplatePreview(undefined)
        }
      } else {
        setCatalogItemDetail(undefined)
        setTemplatePreview(undefined)
      }
    },
    [catalog_item_id, language_code, getTemplatePreview, view.path]
  )

  useEffect(() => {
    const cancelTokenSource = axios.CancelToken.source()

    getCatalogItemDetail(cancelTokenSource.token)

    return () => cancelTokenSource.cancel()
  }, [getCatalogItemDetail])

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
          {!!templatePreview ? (
            <JSXParser
              jsx={templatePreview.template}
              bindings={{
                data: catalogItemDetail,
                language_code,
                catalog_item_id_variable_name,
                load_from_global_context,
              }}
              renderInWrapper={false}
            />
          ) : catalog_item_id_variable_name || load_from_global_context ? (
            <Alert
              message={t('this-module-wil-be-loaded-from-global-context-or-variable-name')}
              type="info"
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
            catalog_item_id,
            language_code,
            catalog_item_id_variable_name,
            load_from_global_context,
          }}
          onConfirm={handleConfigurationChange}
          onCancel={() => setIsConfigurationOpen(false)}
        />
      )}
    </>
  )
}
