import React, { useContext, useCallback } from 'react'
import { ModuleProps, TextDataProps } from 'scenes/ContentDetail/types/Module'
import { Container } from '../styles'
import { ContentDetailContext } from 'scenes/ContentDetail'
import { ModuleTypeEnum } from 'model/api/ModuleTypeEnum'
import { JSXParser } from 'components/JSXParser'
import { Controls } from '../Controls'
import { RichText } from 'components/RichText'
import { useModuleSort } from 'scenes/ContentDetail/hooks/useModuleSort'
import { OnMove } from 'scenes/ContentDetail/types/OnMove'
import { useModuleUpdate } from 'scenes/ContentDetail/hooks/useModuleUpdate'
import { useGetTemplatePreview } from 'scenes/ContentDetail/hooks/useGetTemplatePreview'
import { useDeleteModule } from 'scenes/ContentDetail/hooks/useDeleteModule'
import parse from 'html-react-parser'
import { FileManagerApi } from 'api/FileManager'

const { CMS_BASE_URL } = process.env

export const richTextInitValues: Record<string, any> = {
  menubar: false,
  forced_root_block: false,
  toolbar: `undo redo | formatselect | image 
   | bold italic backcolor | alignleft aligncenter 
   alignright alignjustify | bullist numlist outdent indent | removeformat `,
  plugins: [
    'image imagetools',
    'lists link',
    'searchreplace visualblocks code fullscreen',
    'insertdatetime media table paste code help wordcount',
  ],
  images_upload_url: CMS_BASE_URL + '/filemanager',
  image_upload_credentials: true,
  automatic_uploads: true,
  image_title: true,
  images_upload_handler: async (
    blobInfo: {
      blob: () => any
      filename: () => string
    },
    success: (value: string) => void,
    failure: (value: string) => void,
    _progress: (value: number) => void
  ) => {
    const formData = new FormData()
    formData.append('file', blobInfo.blob(), blobInfo.filename())

    try {
      const {
        data: { location },
      } = await FileManagerApi.upload(formData)

      success(location)
    } catch (e) {
      failure('File upload failed')
    }
  },
  entity_encoding: 'raw',
  paste_as_text: true,
}
export interface TextProps extends ModuleProps {
  onMove?: OnMove
  data: TextDataProps
}

export const Text: React.FC<TextProps> = ({
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
  const { drag, drop, isDragging, ref } = useModuleSort({
    uuid,
    slotId,
    onMove,
    locked,
  })
  const { update } = useModuleUpdate<TextDataProps>({ uuid, slotId })
  const handleDelete = useDeleteModule({ isNew, slotId, uuid, moduleId })
  const templatePreview =
    view && getTemplatePreview(view.path, ModuleTypeEnum.TEXT)

  const handleEditorChange = useCallback(
    (content: string, mutate: boolean = false) => {
      update({ content }, mutate)
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
                hasConfiguration={false}
                onDelete={handleDelete}
              />
            )}
            <JSXParser
              jsx={template}
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
              }}
              renderInWrapper={false}
            />
          </Container>
        </div>
      </>
    )
  } else {
    return null
  }
}
