import React, { useContext, useCallback, useState, useEffect } from 'react'
import {
  ModuleProps,
  CatalogItemDataProps,
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
import { CatalogItemsApi } from 'api/CatalogItems'
import { CatalogItemPublic } from 'model/api/CatalogItemPublic'
import { TemplatePreview } from 'model/api/TemplatePreview'
import { Alert } from 'antd'
import { useTranslation } from 'react-i18next'

export interface CatalogItemProps extends ModuleProps {
  onMove?: OnMove
  data: CatalogItemDataProps
}

export const CatalogItem: React.FC<CatalogItemProps> = ({
  uuid,
  isNew,
  moduleId,
  moduleType,
  data: { catalog_item_id, language_code },
  onMove,
  slotId,
  locked,
}) => {
  const { t } = useTranslation('content-detail')
  const { view } = useContext(ContentDetailContext)
  const [catalogItem, setCatalogItem] = useState<CatalogItemPublic>()
  const [isConfigurationOpen, setIsConfigurationOpen] = useState(false)
  const { getTemplatePreview } = useGetTemplatePreview()
  const { drag, drop, isDragging, ref } = useModuleSort({
    uuid,
    slotId,
    onMove,
    locked,
  })
  const { update } = useModuleUpdate<CatalogItemDataProps>({ uuid, slotId })
  const handleDelete = useDeleteModule({ isNew, slotId, uuid, moduleId })
  const [templatePreview, setTemplatePreview] = useState<TemplatePreview>()

  const handleConfigurationChange = useCallback(
    ({ catalog_item_id, language_code }: Data) => {
      update({ catalog_item_id, language_code }, true)
      setIsConfigurationOpen(false)
    },
    [update]
  )

  const getCatalogItem = useCallback(
    async (cancelToken: CancelToken) => {
      if (catalog_item_id) {
        try {
          const { data } = await CatalogItemsApi.getPublicCatalogItem(
            catalog_item_id,
            language_code,
            true,
            {
              cancelToken,
            }
          )

          setCatalogItem(data)
          setTemplatePreview(
            getTemplatePreview(view.path, data.data.template_path)
          )
        } catch (e) {
          setCatalogItem(undefined)
          setTemplatePreview(undefined)
        }
      } else {
        setCatalogItem(undefined)
        setTemplatePreview(undefined)
      }
    },
    [catalog_item_id, view, getTemplatePreview, language_code]
  )

  useEffect(() => {
    const cancelTokenSource = axios.CancelToken.source()

    getCatalogItem(cancelTokenSource.token)

    return () => cancelTokenSource.cancel()
  }, [getCatalogItem])

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
          {!!templatePreview && catalogItem ? (
            <JSXParser
              jsx={templatePreview.template}
              bindings={{ data: catalogItem }}
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
          data={{ catalog_item_id, language_code }}
          onConfirm={handleConfigurationChange}
          onCancel={() => setIsConfigurationOpen(false)}
        />
      )}
    </>
  )
}
