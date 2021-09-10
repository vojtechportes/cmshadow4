import React, { useContext, useState, useCallback, useEffect } from 'react'
import { Input, Select } from 'formik-antd'
import { FormikFormItem as Item } from 'components/FormikFormItem'
import { useTranslation } from 'react-i18next'
import { PageMetaRobotsEnum } from 'model/api/PageMetaRobotsEnum'
import { Upload } from 'antd'
import { UploadFile, UploadChangeParam } from 'antd/lib/upload/interface'
import { Icon } from 'components/Icon'
import styled from 'styled-components'
import { getBase64 } from 'utils/getBase64'
import { ContentDetailContext } from 'scenes/ContentDetail'
import { IconButton } from 'components/IconButton'
import { COLORS } from 'constants/colors'
import { FormValues } from '../DetailForm'
import { useFormikContext } from 'formik'

const { Dragger } = Upload
const { TextArea } = Input
const { Option } = Select

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

const { CMS_STATIC_URL } = window._envConfig
const imageUrl = CMS_STATIC_URL + '/images/'

export const Meta: React.FC = () => {
  const { page } = useContext(ContentDetailContext)
  const { t } = useTranslation('content-detail')
  const [image, setImage] = useState<string>()
  const { setFieldValue } = useFormikContext<FormValues>()
  const metaImage =
    page && page.meta_image ? `${imageUrl}${page.meta_image}` : undefined
  const [file, setFile] = useState<UploadFile<any> | string>(metaImage)

  const handleChange = useCallback(
    ({ fileList, file: { uid } }: UploadChangeParam<UploadFile<any>>) => {
      const filteredFile = fileList.find(item => item.uid === uid)

      setFile(filteredFile)
      setFieldValue('meta_image', filteredFile)
    },
    [setFieldValue]
  )

  const handleDelete = useCallback(() => {
    setFile(undefined)
    setImage(undefined)
    setFieldValue('meta_image', undefined)
  }, [setFieldValue])

  const getImage = useCallback(async () => {
    if (file) {
      if (typeof file !== 'string') {
        const img = await getBase64(file.originFileObj)

        setImage(img as string)
      } else {
        setImage(file as string)
      }
    }
  }, [file])

  useEffect(() => {
    getImage()
  }, [getImage])

  return (
    <>
      <Item label={t('properties.meta.meta-title')} name="meta_title">
        <Input name="meta_title" />
      </Item>
      <Item
        label={t('properties.meta.meta-description')}
        name="meta_description"
      >
        <TextArea name="meta_description" rows={3} />
      </Item>
      <Item label={t('properties.meta.meta-keywords')} name="meta_keywords">
        <TextArea name="meta_keywords" rows={2} />
      </Item>
      <Item label={t('properties.meta.meta-robots.label')} name="meta_robots">
        <Select name="meta_robots">
          {Object.values(PageMetaRobotsEnum).map(option => (
            <Option key={option} value={option}>
              {t(`properties.meta.meta-robots.options.${option}`)}
            </Option>
          ))}
        </Select>
      </Item>
      <Item label={t('properties.meta.meta-canonical')} name="meta_canonical">
        <Input name="meta_canonical" />
      </Item>
      <Item label={t('properties.meta.meta-image.label')} name="meta_image">
        <Dragger
          multiple={false}
          beforeUpload={() => {
            return false
          }}
          showUploadList={false}
          accept="image/*"
          onChange={info => handleChange(info)}
        >
          <Icon icon="cloud-upload-alt" size="2x" />
          <p>{t('properties.meta.meta-image.upload-file-text')}</p>
        </Dragger>
        {image && (
          <ImageContainer style={{ backgroundImage: `url(${image})` }}>
            <IconButton size="small" icon="trash-alt" onClick={handleDelete}>
              {t('properties.meta.meta-image.delete')}
            </IconButton>
          </ImageContainer>
        )}
      </Item>
    </>
  )
}
