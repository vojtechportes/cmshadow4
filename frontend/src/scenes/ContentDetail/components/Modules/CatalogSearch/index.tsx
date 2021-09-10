import React, { useContext, useCallback, useState } from 'react'
import {
  ModuleProps,
  CatalogSearchDataProps,
} from 'scenes/ContentDetail/types/Module'
import { Container } from '../styles'
import { ContentDetailContext } from 'scenes/ContentDetail'
import { ModuleTypeEnum } from 'model/api/ModuleTypeEnum'
import { JSXParser } from 'components/JSXParser'
import { Controls } from '../Controls'
import { useModuleSort } from 'scenes/ContentDetail/hooks/useModuleSort'
import { OnMove } from 'scenes/ContentDetail/types/OnMove'
import { useModuleUpdate } from 'scenes/ContentDetail/hooks/useModuleUpdate'
import { Configuration, Data } from './Configuration'
import { useGetTemplatePreview } from 'scenes/ContentDetail/hooks/useGetTemplatePreview'
import { useDeleteModule } from 'scenes/ContentDetail/hooks/useDeleteModule'

export interface CatalogSearchProps extends ModuleProps {
  onMove?: OnMove
  data: CatalogSearchDataProps
}

export const CatalogSearch: React.FC<CatalogSearchProps> = ({
  uuid,
  moduleType,
  isNew,
  moduleId,
  data: { search_placeholder, submit_label },
  onMove,
  slotId,
  locked,
}) => {
  const { view } = useContext(ContentDetailContext)
  const [isConfigurationOpen, setIsConfigurationOpen] = useState(false)
  const { getTemplatePreview } = useGetTemplatePreview()
  const { drag, drop, isDragging, ref } = useModuleSort({
    uuid,
    slotId,
    onMove,
    locked,
  })
  const { update } = useModuleUpdate<CatalogSearchDataProps>({
    uuid,
    slotId,
  })
  const handleDelete = useDeleteModule({ isNew, slotId, uuid, moduleId })

  const templatePreview =
    view && getTemplatePreview(view.path, ModuleTypeEnum.CATALOG_SEARCH)

  const handleConfigurationChange = useCallback(
    ({ search_placeholder, submit_label }: Data) => {
      update({ search_placeholder, submit_label }, true)
      setIsConfigurationOpen(false)
    },
    [update]
  )

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
                search_placeholder,
                submit_label,
              }}
              renderInWrapper={false}
            />
          </Container>
        </div>
        {isConfigurationOpen && (
          <Configuration
            data={{ search_placeholder, submit_label }}
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
