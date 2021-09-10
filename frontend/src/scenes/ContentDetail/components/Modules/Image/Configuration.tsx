import React, { useCallback, useState, useEffect } from 'react'
import { Modal, Form, Upload, Input } from 'antd'
import { useTranslation } from 'react-i18next'
import { ImageDataProps } from 'scenes/ContentDetail/types/Module'
import { Icon } from 'components/Icon'
import { UploadFile, UploadChangeParam } from 'antd/lib/upload/interface'
import { getBase64 } from 'utils/getBase64'
import styled from 'styled-components'
import { COLORS } from 'constants/colors'

const { CMS_STATIC_URL } = window._envConfig
const imageUrl = CMS_STATIC_URL + '/images/'

const ImageContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  width: 240px;
  height: 240px;
  margin-top: 24px;
  padding: 12px;
  overflow: hidden;
  background-repeat: no-repeat;
  background-position: 50% 50%;
  background-size: cover;
  border: 1px solid ${COLORS.gray2};
  border-radius: 2px;
`

const { Dragger } = Upload

export type Data = ImageDataProps

export interface ConfigurationProps {
  data: Data
  onConfirm: (data: Data) => void
  onCancel: () => void
}

const { Item } = Form

export const Configuration: React.FC<ConfigurationProps> = ({
  data,
  onConfirm,
  onCancel,
}) => {
  const { t } = useTranslation('content-detail')
  const [configuration, setConfiguration] = useState(data)
  const [image, setImage] = useState<string>()

  const handleConfirm = useCallback(() => {
    onConfirm(configuration)
  }, [onConfirm, configuration])

  const handleImageAltChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      event.persist()

      setConfiguration(value => ({
        ...value,
        image_alt: event.target.value,
      }))
    },
    []
  )

  const getImage = useCallback(async (image?: UploadFile) => {
    if (image) {
      setImage((await getBase64(image.originFileObj)) as string)
    }
  }, [])

  const handleImageChange = useCallback(
    async ({ fileList, file: { uid } }: UploadChangeParam<UploadFile<any>>) => {
      const filteredImage = fileList.find(item => item.uid === uid)

      getImage(filteredImage)

      setConfiguration(value => ({
        ...value,
        image: filteredImage,
      }))
    },
    [getImage]
  )

  useEffect(() => {
    if (data.image) {
      getImage(data.image)
    }
  }, [data, getImage])

  const hasImage = image || data.file_name !== ''

  return (
    <Modal
      visible
      width={600}
      onOk={handleConfirm}
      onCancel={onCancel}
      title={t('image-configuration.title')}
    >
      <Form layout="vertical">
        <Item label={t('image-configuration.image')}>
          <Dragger
            multiple={false}
            beforeUpload={() => {
              return false
            }}
            showUploadList={false}
            accept="image/*"
            onChange={handleImageChange}
          >
            <Icon icon="cloud-upload-alt" size="2x" />
            <p>{t('image-configuration.image-upload')}</p>
          </Dragger>
          {hasImage && (
              <ImageContainer
                style={{
                  backgroundImage: `url(${image ||
                    imageUrl + data.file_name})`,
                }}
              />
            )}
        </Item>
        <Item label={t('image-configuration.image-title')}>
          <Input onChange={handleImageAltChange} defaultValue={data.image_alt} />
        </Item>
      </Form>
    </Modal>
  )
}
