import React, { useContext, useRef, useCallback } from 'react'
import { CatalogDetailContext } from '..'
import { Info, InfoItemProps } from 'components/Info'
import { DATE_TIME_FORMAT } from 'constants/date'
import { format } from 'date-fns'
import { useTranslation } from 'react-i18next'
import { COLORS } from 'constants/colors'
import { Tag, Button, notification } from 'antd'
import styled from 'styled-components'
import { IconButton } from 'components/IconButton'
import axios, { CancelTokenSource } from 'axios'
import { CatalogItemsApi } from 'api/CatalogItems'

const { Group } = Button

const StyledInfo = styled(Info)`
  margin-bottom: 24px;
`

const Buttons = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 24px;
`

export const DetailInfo: React.FC = () => {
  const { t } = useTranslation('catalog-detail')
  const { data, getData, loading } = useContext(CatalogDetailContext)
  const cancelTokenRef = useRef<CancelTokenSource>(axios.CancelToken.source())

  const handlePublish = useCallback(async () => {
    if (data) {
      try {
        await CatalogItemsApi.publishCatalogItem(data.id, {
          cancelToken: cancelTokenRef.current.token,
        })

        notification.success({
          message: t('publish-success'),
        })

        getData()
      } catch (e) {}
    }
  }, [data, getData, t])

  const handleUnpublish = useCallback(async () => {
    if (data) {
      try {
        await CatalogItemsApi.unpublishCatalogItem(data.id, {
          cancelToken: cancelTokenRef.current.token,
        })

        notification.success({
          message: t('unpublish-success'),
        })

        getData()
      } catch (e) {}
    }
  }, [data, getData, t])

  if (data) {
    const { created_at, modified_at, published_at, published } = data

    const items: InfoItemProps[] = [
      {
        key: 'created-at',
        label: t('info.created-at'),
        value: created_at
          ? format(new Date(created_at), DATE_TIME_FORMAT)
          : '-',
      },
      {
        key: 'modified-at',
        label: t('info.modified-at'),
        value: modified_at
          ? format(new Date(modified_at), DATE_TIME_FORMAT)
          : '-',
      },
      {
        key: 'published-at',
        label: t('info.published-at'),
        value: published_at
          ? format(new Date(published_at), DATE_TIME_FORMAT)
          : '-',
      },
      {
        key: 'status',
        label: t('info.status'),
        value: !!published && (
          <Tag color={COLORS.green2}>{t('info.published')}</Tag>
        ),
      },
    ]

    return (
      <>
        <Buttons>
          <Group>
            <IconButton
              icon="cloud-upload-alt"
              size="middle"
              type="default"
              disabled={!!published || loading}
              onClick={handlePublish}
            >
              {t('info.publish')}
            </IconButton>
            <IconButton
              icon="cloud-download-alt"
              size="middle"
              type="default"
              disabled={!published || loading}
              onClick={handleUnpublish}
            >
              {t('info.unpublish')}
            </IconButton>
            <IconButton icon="trash-alt" size="middle" type="danger" disabled>
              {t('info.delete')}
            </IconButton>
          </Group>
        </Buttons>
        <StyledInfo items={items} loading={loading} />
      </>
    )
  }

  return null
}
