import React, { useState, useCallback, useEffect } from 'react'
import { UploadFile } from 'antd/lib/upload/interface'
import { getBase64 } from 'utils/getBase64'
import styled from 'styled-components'
import { COLORS } from 'constants/colors'
import { Form, Input } from 'antd'
import { IconButton } from 'components/IconButton'
import { useTranslation } from 'react-i18next'

const { Item } = Form
const { TextArea } = Input

const Title = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 0 0 10px;
  padding: 0 0 6px;
  font-weight: bold;
  border-bottom: 1px solid ${COLORS.gray2};
`

const Container = styled.div`
  display: grid;
  grid-gap: 24px;
  grid-template-columns: 120px auto;
  padding: 12px;
  background: ${COLORS.gray1};
  border: 1px solid ${COLORS.gray2};
  border-radius: 2px;

  .ant-form-item-label {
    line-height: 1.1;

    label {
      height: initial;
    }
  }

  .ant-form-item {
    margin-bottom: 12px;

    &:last-child {
      margin-bottom: 0;
    }
  }
`

const ImageContainer = styled.div`
  width: 120px;
  height: 120px;
  overflow: hidden;
  background-repeat: no-repeat;
  background-position: 50% 50%;
  background-size: cover;
  border: 1px solid ${COLORS.gray2};
  border-radius: 2px;
`

export interface UploadedGalleryImageProps {
  file: UploadFile
  onDelete?: (file: UploadFile) => void
  onTitleChange?: (value: string) => void
  onDescriptionChange?: (value: string) => void
}

export const UploadedGalleryImage: React.FC<UploadedGalleryImageProps> = ({
  file,
  onDelete,
  onTitleChange,
  onDescriptionChange,
}) => {
  const [image, setImage] = useState<string>()
  const { t } = useTranslation('catalog-detail')

  const getImage = useCallback(async () => {
    if (file) {
      const img = await getBase64(file.originFileObj)

      setImage(img as string)
    }
  }, [file])

  useEffect(() => {
    getImage()
  }, [getImage])

  return (
    <Container>
      <ImageContainer style={{ backgroundImage: `url(${image})` }} />

      <div>
        <Title>
          <div>{file.name}</div>
          <IconButton
            size="small"
            icon="trash-alt"
            onClick={() => onDelete && onDelete(file)}
          >
            {t('fields.gallery-image.delete')}
          </IconButton>
        </Title>

        <Item label={t('fields.gallery-image.title')}>
          <Input
            onChange={event =>
              onTitleChange && onTitleChange(event.target.value)
            }
          />
        </Item>

        <Item label={t('fields.gallery-image.description')}>
          <TextArea
            onChange={event =>
              onDescriptionChange && onDescriptionChange(event.target.value)
            }
            rows={2}
          />
        </Item>
      </div>
    </Container>
  )
}
