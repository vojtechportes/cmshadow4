import React, { useState, useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { getBase64 } from 'utils/getBase64'
import { UploadFile } from 'antd/lib/upload/interface'
import styled from 'styled-components'
import { COLORS } from 'constants/colors'
import { IconButton } from 'components/IconButton'

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

export interface UploadedImageProps {
  file: UploadFile | string
  onDelete?: () => void
}

export const UploadedImage: React.FC<UploadedImageProps> = ({
  file,
  onDelete,
}) => {
  const [image, setImage] = useState<string>()
  const { t } = useTranslation('catalog-detail')

  const getImage = useCallback(async () => {
    if (typeof file !== 'string') {
      const img = await getBase64(file.originFileObj)

      setImage(img as string)
    } else {
      setImage(file as string)
    }
  }, [file])

  useEffect(() => {
    getImage()
  }, [getImage])

  return (
    <ImageContainer style={{ backgroundImage: `url(${image})` }}>
      <IconButton
        size="small"
        icon="trash-alt"
        onClick={() => onDelete && onDelete()}
      >
        {t('fields.image.delete')}
      </IconButton>
    </ImageContainer>
  )
}
