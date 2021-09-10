import React, { useCallback, useState, useEffect, useContext } from 'react'
import {
  ModuleProps,
  CatalogListingDataProps,
} from 'scenes/ContentDetail/types/Module'
import { Container } from '../styles'
import { ModuleTypeEnum } from 'model/api/ModuleTypeEnum'
import { JSXParser } from 'components/JSXParser'
import { Controls } from '../Controls'
import { useModuleSort } from 'scenes/ContentDetail/hooks/useModuleSort'
import { OnMove } from 'scenes/ContentDetail/types/OnMove'
import { useModuleUpdate } from 'scenes/ContentDetail/hooks/useModuleUpdate'
import { useGetTemplatePreview } from 'scenes/ContentDetail/hooks/useGetTemplatePreview'
import { useDeleteModule } from 'scenes/ContentDetail/hooks/useDeleteModule'
import { CatalogItemsApi } from 'api/CatalogItems'
import axios, { CancelToken } from 'axios'
import { PaginatedList } from 'model/api/PaginatedList'
import { List } from './List'
import { ContentDetailContext } from 'scenes/ContentDetail'
import { CatalogItemPublic } from 'model/api/CatalogItemPublic'
import { Configuration } from './Configuration'

export interface CatalogListingProps extends ModuleProps {
  onMove?: OnMove
  data: CatalogListingDataProps
}

export const CatalogListing: React.FC<CatalogListingProps> = ({
  uuid,
  isNew,
  moduleId,
  moduleType,
  data: { language_code, category_id, category_id_variable_name, sort },
  onMove,
  slotId,
  locked,
}) => {
  const { view } = useContext(ContentDetailContext)
  const [isConfigurationOpen, setIsConfigurationOpen] = useState(false)
  const [listingData, setListingData] = useState<
    PaginatedList<CatalogItemPublic>
  >()
  const { getTemplatePreview } = useGetTemplatePreview()
  const { drag, drop, isDragging, ref } = useModuleSort({
    uuid,
    slotId,
    onMove,
    locked,
  })
  const { update } = useModuleUpdate<CatalogListingDataProps>({ uuid, slotId })
  const handleDelete = useDeleteModule({ isNew, slotId, uuid, moduleId })
  const templatePreview =
    view && getTemplatePreview(view.path, ModuleTypeEnum.CATALOG_LISTING)

  const handleConfigurationChange = useCallback(
    ({
      category_id,
      language_code,
      category_id_variable_name,
      sort,
    }: CatalogListingDataProps) => {
      update({ category_id, language_code, category_id_variable_name, sort }, true)
      setIsConfigurationOpen(false)
    },
    [update]
  )

  const getListingData = useCallback(async (cancelToken: CancelToken) => {
    const { data } = await CatalogItemsApi.getPublicCatalogItems(
      undefined,
      undefined,
      language_code,
      category_id,
      {
        cancelToken,
      }
    )

    setListingData(data)
  }, [language_code, category_id])

  useEffect(() => {
    const cancelTokenSource = axios.CancelToken.source()

    getListingData(cancelTokenSource.token)

    return () => cancelTokenSource.cancel()
  }, [getListingData])

  if (templatePreview) {
    const template = templatePreview.template

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
                hasConfiguration
                onConfigure={() => setIsConfigurationOpen(true)}
                onDelete={handleDelete}
              />
            )}
            {!!listingData && (
              <JSXParser
                jsx={template}
                bindings={{ data: listingData }}
                components={{ List }}
                renderInWrapper={false}
                onError={e => console.log(e)}
              />
            )}
          </Container>
        </div>
        {isConfigurationOpen && (
          <Configuration
            data={{ language_code, category_id, category_id_variable_name, sort }}
            onConfirm={handleConfigurationChange}
            onCancel={() => setIsConfigurationOpen(false)}
          />
        )}
      </>
    )
  } else {
    return null
  }
}
