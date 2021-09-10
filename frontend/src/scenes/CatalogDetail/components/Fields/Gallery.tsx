import React, { useState, useCallback } from 'react'
import { CatalogItemDetailField } from 'model/api/CatalogItemDetailField'
import { Upload } from 'antd'
import { CatalogLanguage } from 'model/api/CatalogLanguage'
import { Icon } from 'components/Icon'
import { useFormikContext } from 'formik'
import { UploadFile, UploadChangeParam } from 'antd/lib/upload/interface'
import styled from 'styled-components'
import { Header } from 'components/Header'
import { CatalogGalleryImageValues } from 'model/api/CatalogGalleryImageValue'
import { useTranslation } from 'react-i18next'
import { FieldGroup } from './styles'
import { getFieldName } from './utils/getFieldName'
import { getExtraContentFieldName } from './utils/getExtraContentFieldName'
import { render } from './utils/render'
import { GalleryImageDraggable } from './components/GalleryImage'
import { UploadedGalleryImage } from './components/UploadedGalleryImage'
import { getFieldValue } from './utils/getFieldValue'
import update from 'immutability-helper'

const { Dragger } = Upload

const { CMS_STATIC_URL } = window._envConfig
const catalogUrl = CMS_STATIC_URL + '/images/catalog/'

const GalleryImages = styled.div`
  display: grid;
  grid-gap: 12px;
  grid-template-columns: 1fr 1fr 1fr;
  margin: 24px 0;
`

const StyledHeader = styled(Header)`
  margin-top: 24px;
`

export interface GalleryProps {
  field: CatalogItemDetailField
  languages: CatalogLanguage[]
}

export const Gallery: React.FC<GalleryProps> = ({ languages, field }) => {
  const { is_multilingual, id } = field
  const { setFieldValue, values } = useFormikContext<any>()
  const [fileList, setFileList] = useState<
    UploadFile[] | { [key: string]: UploadFile[] }
  >([])
  const { t } = useTranslation('catalog-detail')

  const getImages = useCallback(
    (language: CatalogLanguage) => {
      let images: CatalogGalleryImageValues[] = []

      if (values.fields[field.id]) {
        if (language) {
          if (values.fields[field.id][language.code]) {
            images = values.fields[field.id][language.code].value
          }
        } else {
          images = values.fields[field.id].value
        }
      }

      return images
    },
    [values, field.id]
  )

  const handleUploadedImageTitleChange = useCallback(
    (name: string, value: string, index: number) => {
      const fieldName = `${getExtraContentFieldName(name)}[${index}][title]`

      setFieldValue(fieldName, value)
    },
    [setFieldValue]
  )

  const handleUploadedImageDescriptionChange = useCallback(
    (name: string, value: string, index: number) => {
      const fieldName = `${getExtraContentFieldName(
        name
      )}[${index}][description]`

      setFieldValue(fieldName, value)
    },
    [setFieldValue]
  )

  const handleUploadedImageDelete = useCallback(
    (name: string, file: UploadFile<any>) => {
      const imageFieldName = getFieldName(name) + '[images]'

      if (is_multilingual) {
        const language = imageFieldName.match(/.*\[(.*)\]\[images\]/)[1]
        const newFileList = fileList[language].filter(
          item => item.uid !== file.uid
        )

        setFileList(value => {
          value[language] = newFileList

          return value
        })

        setFieldValue(imageFieldName, newFileList)
      } else {
        const newFileList = (fileList as UploadFile<any>[]).filter(
          item => item.uid !== file.uid
        )

        setFileList(newFileList)
        setFieldValue(imageFieldName, newFileList)
      }
    },
    [fileList, setFileList, setFieldValue, is_multilingual]
  )

  const handleImageTitleChange = useCallback(
    (value: string, index: number, name: string, language: CatalogLanguage) => {
      const images = getImages(language)

      const newImages = images.map((image, currentIndex) => {
        if (index === currentIndex) {
          return { ...image, title: value }
        } else {
          return image
        }
      })

      setFieldValue(name, newImages)
    },
    [setFieldValue, getImages]
  )

  const handleImageDescriptionChange = useCallback(
    (value: string, index: number, name: string, language: CatalogLanguage) => {
      const images = getImages(language)

      const newImages = images.map((image, currentIndex) => {
        if (index === currentIndex) {
          return { ...image, description: value }
        } else {
          return image
        }
      })

      setFieldValue(name, newImages)
    },
    [setFieldValue, getImages]
  )

  const handleImageDelete = useCallback(
    (index: number, name: string, language: CatalogLanguage) => {
      const images = getImages(language)

      const newImages = images.filter(
        (_, currentIndex) => currentIndex !== index
      )

      setFieldValue(name, newImages)
    },
    [setFieldValue, getImages]
  )

  const handleChange = useCallback(
    (name, { fileList }: UploadChangeParam<UploadFile<any>>) => {
      const imageFieldName = getFieldName(name) + '[images]'

      if (is_multilingual) {
        const language = imageFieldName.match(/.*\[(.*)\]\[images\]/)[1]

        setFileList(value => {
          value[language] = fileList

          return value
        })
      } else {
        setFileList(fileList)
      }

      setFieldValue(imageFieldName, fileList)
    },
    [setFieldValue, is_multilingual]
  )

  const handleMove = useCallback(
    (
      dragIndex: number,
      hoverIndex: number,
      name: string,
      language?: CatalogLanguage
    ) => {
      const dragGalleryImages = getFieldValue<CatalogGalleryImageValues[]>(
        values,
        id,
        language && language.code
      )
      const dragGalleryImage = dragGalleryImages[dragIndex]

      setFieldValue(
        name,
        update(dragGalleryImages, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, dragGalleryImage],
          ],
        })
      )
    },
    [values, id, setFieldValue]
  )

  const renderInput = useCallback(
    (name: string, language?: CatalogLanguage) => {
      const images = getImages(language)
      let files: UploadFile<any>[] = []

      if (is_multilingual) {
        files =
          (fileList as {
            [key: string]: UploadFile<any>[]
          })[language.code] || []
      } else {
        files = fileList as UploadFile<any>[]
      }

      return (
        <>
          <Dragger
            multiple={true}
            beforeUpload={() => {
              return false
            }}
            accept="image/*"
            showUploadList={false}
            onChange={info => handleChange(name, info)}
          >
            <Icon icon="cloud-upload-alt" size="2x" />
            <p>{t('fields.gallery.upload-files-text')}</p>
          </Dragger>

          {images && (
            <GalleryImages>
              {images.map(({ thumbnail, title, description }, index) => (
                <GalleryImageDraggable
                  key={thumbnail}
                  index={index}
                  onDelete={value => handleImageDelete(value, name, language)}
                  imagePath={catalogUrl + thumbnail}
                  titleValue={title}
                  onTitleChange={(value, valueIndex) =>
                    handleImageTitleChange(value, valueIndex, name, language)
                  }
                  descriptionValue={description}
                  onDescriptionChange={(value, valueIndex) =>
                    handleImageDescriptionChange(
                      value,
                      valueIndex,
                      name,
                      language
                    )
                  }
                  onMove={(dragIndex, hoverIndex) =>
                    handleMove(dragIndex, hoverIndex, name, language)
                  }
                />
              ))}
            </GalleryImages>
          )}

          {files.length > 0 && (
            <StyledHeader>{t('fields.gallery.new-images')}</StyledHeader>
          )}

          <GalleryImages>
            {files.map((file: UploadFile, index) => (
              <UploadedGalleryImage
                key={index}
                file={file}
                onTitleChange={value =>
                  handleUploadedImageTitleChange(name, value, index)
                }
                onDescriptionChange={value =>
                  handleUploadedImageDescriptionChange(name, value, index)
                }
                onDelete={file => handleUploadedImageDelete(name, file)}
              />
            ))}
          </GalleryImages>
        </>
      )
    },
    [
      handleUploadedImageDescriptionChange,
      handleUploadedImageTitleChange,
      handleUploadedImageDelete,
      handleImageDescriptionChange,
      handleImageTitleChange,
      handleImageDelete,
      handleChange,
      getImages,
      t,
      fileList,
      handleMove,
      is_multilingual,
    ]
  )

  if (is_multilingual) {
    return (
        <FieldGroup>
          {languages.map(language =>
            render(
              field,
              (name: string) => renderInput(name, language),
              language
            )
          )}
        </FieldGroup>
    )
  }

  return (
    <FieldGroup>
      {render(field, (name: string) => renderInput(name))}
    </FieldGroup>
  )
}
