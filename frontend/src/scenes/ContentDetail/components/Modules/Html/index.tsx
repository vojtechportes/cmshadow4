import React, { useContext, useCallback, useState } from 'react'
import { ModuleProps, HtmlDataProps } from 'scenes/ContentDetail/types/Module'
import { Container } from '../styles'
import { ContentDetailContext } from 'scenes/ContentDetail'
import { ModuleTypeEnum } from 'model/api/ModuleTypeEnum'
import { JSXParser } from 'components/JSXParser'
import { Controls } from '../Controls'
import { useModuleSort } from 'scenes/ContentDetail/hooks/useModuleSort'
import { OnMove } from 'scenes/ContentDetail/types/OnMove'
import { useModuleUpdate } from 'scenes/ContentDetail/hooks/useModuleUpdate'
import { useGetTemplatePreview } from 'scenes/ContentDetail/hooks/useGetTemplatePreview'
import { useDeleteModule } from 'scenes/ContentDetail/hooks/useDeleteModule'
import { Configuration } from './Configuration'

export interface HtmlProps extends ModuleProps {
  onMove?: OnMove
  data: HtmlDataProps
}

export const Html: React.FC<HtmlProps> = ({
  uuid,
  isNew,
  moduleId,
  moduleType,
  data: { content = '' },
  onMove,
  slotId,
  locked,
}) => {
  const { view } = useContext(ContentDetailContext)
  const { getTemplatePreview } = useGetTemplatePreview()
  const [isConfigurationOpen, setIsConfigurationOpen] = useState(false)
  const { drag, drop, isDragging, ref } = useModuleSort({
    uuid,
    slotId,
    onMove,
    locked,
  })
  const { update } = useModuleUpdate<HtmlDataProps>({ uuid, slotId })
  const handleDelete = useDeleteModule({ isNew, slotId, uuid, moduleId })
  const templatePreview =
    view && getTemplatePreview(view.path, ModuleTypeEnum.HTML)

  const handleConfigurationChange = useCallback(
    ({ content }: HtmlDataProps) => {
      update({ content }, true)
      setIsConfigurationOpen(false)
    },
    [update]
  )

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
                onConfigure={() => setIsConfigurationOpen(true)}
                onDelete={handleDelete}
              />
            )}
            <JSXParser
              jsx={template}
              bindings={{
                content,
              }}
              renderInWrapper={false}
            />
          </Container>
        </div>
        {isConfigurationOpen && (
          <Configuration
            data={{ content }}
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
