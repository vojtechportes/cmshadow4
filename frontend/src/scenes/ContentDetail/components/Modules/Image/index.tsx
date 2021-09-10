import React, {
  useContext,
  useCallback,
  useState,
  useEffect,
} from 'react'
import { ModuleProps, ImageDataProps } from 'scenes/ContentDetail/types/Module'
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
import { getBase64 } from 'utils/getBase64'
import { Alert } from 'antd'
import { useTranslation } from 'react-i18next'

const { CMS_STATIC_URL } = window._envConfig
const imageUrl = CMS_STATIC_URL + '/images/'

export interface ImageProps extends ModuleProps {
  onMove?: OnMove
  data: ImageDataProps
}

export const Image: React.FC<ImageProps> = ({
  uuid,
  moduleType,
  isNew,
  moduleId,
  data: { file_name, image, image_alt },
  onMove,
  slotId,
  locked,
}) => {
  const { t } = useTranslation('content-detail')
  const { view, setFiles } = useContext(ContentDetailContext)
  const [isConfigurationOpen, setIsConfigurationOpen] = useState(false)
  const { getTemplatePreview } = useGetTemplatePreview()
  const { drag, drop, isDragging, ref } = useModuleSort({
    uuid,
    slotId,
    onMove,
    locked,
  })
  const { update } = useModuleUpdate<ImageDataProps>({ uuid, slotId })
  const handleDelete = useDeleteModule({ isNew, slotId, uuid, moduleId })
  const [uploadedImage, setUploadedImage] = useState<string>()

  const templatePreview =
    view && getTemplatePreview(view.path, ModuleTypeEnum.IMAGE)

  const handleConfigurationChange = useCallback(
    ({ file_name, image, image_alt }: Data) => {
      update({ file_name, image, image_alt }, true)
      setIsConfigurationOpen(false)
    },
    [update]
  )

  const setUploadedImagePreview = useCallback(async () => {
    if (image) {
      setUploadedImage((await getBase64(image.originFileObj)) as string)
      setFiles(value => ({ ...value, [uuid]: [image] }))
    }
  }, [image, uuid, setFiles])

  useEffect(() => {
    setUploadedImagePreview()
  }, [setUploadedImagePreview])

  if (templatePreview) {
    console.log(uploadedImage)

    const template = templatePreview.template
    const hasImage = uploadedImage || file_name
    const currentImage = uploadedImage || imageUrl + file_name

    const opacity = isDragging ? 0 : 1
    drag(drop(ref))

    return (
      <>
        <div ref={ref} style={{ opacity }}>
          <Container locked={locked}>
          {!locked && <Controls
              moduleType={moduleType}
              hasEdit={false}
              onConfigure={() => setIsConfigurationOpen(true)}
              onDelete={handleDelete}
            />}
            {hasImage ? (
              <JSXParser
                jsx={template}
                bindings={{
                  file_name: currentImage,
                  image_alt,
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
            data={{ file_name, image, image_alt }}
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
