import React, { useCallback, useState } from 'react'
import { Icon } from 'components/Icon'
import { Upload } from 'antd'
import { useTranslation } from 'react-i18next'
import { getFieldName } from './utils/getFieldName'
import { CatalogItemDetailField } from 'model/api/CatalogItemDetailField'
import { CatalogLanguage } from 'model/api/CatalogLanguage'
import { UploadChangeParam } from 'antd/lib/upload'
import { UploadFile } from 'antd/lib/upload/interface'
import { useFormikContext } from 'formik'
import { FieldGroup } from './styles'
import { render } from './utils/render'
import { UploadedImage } from './components/UploadedImage'

const { CMS_STATIC_URL } = window._envConfig
const catalogUrl = CMS_STATIC_URL + '/images/catalog/'

const { Dragger } = Upload

export interface ImageProps {
  field: CatalogItemDetailField
  languages: CatalogLanguage[]
}

export const Image: React.FC<ImageProps> = ({ languages, field }) => {
  const { t } = useTranslation('catalog-detail')
  const { is_multilingual } = field
  const { setFieldValue, values } = useFormikContext<any>()
  const [file, setFile] = useState<
    UploadFile<any> | { [key: string]: UploadFile<any> }
  >()

  const getImage = useCallback(
    (language?: CatalogLanguage) => {
      let image

      if (values.fields[field.id]) {
        if (language) {
          if (values.fields[field.id][language.code]) {
            image = values.fields[field.id][language.code].value
          }
        } else {
          image = values.fields[field.id].value
        }
      }

      if (image) {
        return image.thumbnail
      }
    },
    [values, field.id]
  )

  const handleChange = useCallback(
    (name, { fileList, file: { uid } }: UploadChangeParam<UploadFile<any>>) => {
      const imageFieldName = getFieldName(name) + '[image]'
      const filteredFile = fileList.find(item => item.uid === uid)

      if (is_multilingual) {
        const language = imageFieldName.match(/.*\[(.*)\]\[image\]/)[1]

        setFile(value => {
          value[language] = filteredFile

          return value
        })
      } else {
        setFile(filteredFile)
      }

      setFieldValue(imageFieldName, filteredFile)
    },
    [setFieldValue, is_multilingual]
  )

  const handleDelete = useCallback(
    (name: string) => {
      if (file) {
        const imageFieldName = getFieldName(name) + '[image]'

        if (is_multilingual) {
          const language = imageFieldName.match(/.*\[(.*)\]\[image\]/)[1]
          setFile(value => {
            value[language] = undefined

            return value
          })
        } else {
          setFile(undefined)
        }
        setFieldValue(imageFieldName, undefined)
      } else {
        setFieldValue(name, '')
      }
    },
    [file, setFieldValue, is_multilingual]
  )

  const renderInput = useCallback(
    (name: string, language?: CatalogLanguage) => {
      let previewFile: UploadFile<any> | string | undefined = undefined
      const image = getImage(language)

      if (language) {
        if (file && file[language.code]) {
          previewFile = file[language.code] as UploadFile<any>
        } else {
          if (image) {
            previewFile = (catalogUrl + image) as string
          }
        }
      } else {
        if (file) {
          previewFile = file as UploadFile<any>
        } else {
          if (image) {
            previewFile = (catalogUrl + image) as string
          }
        }
      }

      return (
        <>
          <Dragger
            multiple={false}
            beforeUpload={() => {
              return false
            }}
            showUploadList={false}
            accept="image/*"
            onChange={info => handleChange(name, info)}
          >
            <Icon icon="cloud-upload-alt" size="2x" />
            <p>{t('fields.image.upload-file-text')}</p>
          </Dragger>
          {!!previewFile && (
            <UploadedImage
              file={previewFile}
              onDelete={() => handleDelete(name)}
            />
          )}
        </>
      )
    },
    [t, file, getImage, handleDelete, handleChange]
  )

  if (is_multilingual) {
    return (
      <FieldGroup>
        {languages.map(language =>
          render(field, (name: string) => renderInput(name, language), language)
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
