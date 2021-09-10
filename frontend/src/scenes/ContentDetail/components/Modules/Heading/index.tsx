import React, { useContext, useCallback, useState } from 'react'
import {
  ModuleProps,
  HeadingDataProps,
} from 'scenes/ContentDetail/types/Module'
import { Container } from '../styles'
import { ContentDetailContext } from 'scenes/ContentDetail'
import { ModuleTypeEnum } from 'model/api/ModuleTypeEnum'
import { JSXParser } from 'components/JSXParser'
import { Controls } from '../Controls'
import { RichText } from 'components/RichText'
import { useModuleSort } from 'scenes/ContentDetail/hooks/useModuleSort'
import { OnMove } from 'scenes/ContentDetail/types/OnMove'
import { useModuleUpdate } from 'scenes/ContentDetail/hooks/useModuleUpdate'
import { Configuration, Data } from './Configuration'
import { useGetTemplatePreview } from 'scenes/ContentDetail/hooks/useGetTemplatePreview'
import { useDeleteModule } from 'scenes/ContentDetail/hooks/useDeleteModule'
import parse from 'html-react-parser'

export const richTextInitValues: Record<string, any> = {
  menubar: false,
  forced_root_block: false,
  valid_elements: 'strong,em,span[style],a[href]',
  toolbar: `undo redo
   | bold italic backcolor | alignleft aligncenter 
   alignright alignjustify`,
  plugins: ['link'],
  entity_encoding: 'raw',
  paste_as_text: true,
}

export interface HeadingProps extends ModuleProps {
  onMove?: OnMove
  data: HeadingDataProps
}

export const Heading: React.FC<HeadingProps> = ({
  uuid,
  moduleType,
  isNew,
  moduleId,
  data: { content, level },
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
  const { update } = useModuleUpdate<HeadingDataProps>({ uuid, slotId })
  const handleDelete = useDeleteModule({ isNew, slotId, uuid, moduleId })

  const templatePreview =
    view && getTemplatePreview(view.path, ModuleTypeEnum.HEADING)

  const handleEditorChange = useCallback(
    (content: string, mutate: boolean = false) => {
      update({ content }, mutate)
    },
    [update]
  )

  const handleConfigurationChange = useCallback(
    ({ level: headingLevel }: Data) => {
      update({ level: headingLevel }, true)
      setIsConfigurationOpen(false)
    },
    [update]
  )

  if (templatePreview) {
    const template = templatePreview.template
    const Level = `h${level}`

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
            {content && (
              <JSXParser
                jsx={template}
                components={{ Level }}
                bindings={{
                  content: locked ? (
                    parse(content)
                  ) : (
                    <RichText
                      init={richTextInitValues}
                      value={content}
                      onBlur={(_, editor) => {
                        handleEditorChange(editor.save(), true)
                      }}
                      onChange={value => handleEditorChange(value, false)}
                      inline
                    />
                  ),
                  level,
                }}
                renderInWrapper={false}
              />
            )}
          </Container>
        </div>
        {isConfigurationOpen && (
          <Configuration
            data={{ level }}
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
