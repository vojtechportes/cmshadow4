import React, { useCallback, useState, useEffect } from 'react'
import styled from 'styled-components'
import { Info, InfoItemProps } from 'components/Info'
import { useTranslation } from 'react-i18next'
import { NavigationItem } from 'model/api/NavigationItem'
import axios, { CancelToken } from 'axios'
import { NavigationsItemsApi } from 'api/NavigationItems'
import { Tag } from 'antd'
import { PAGE_STATUS_COLORS } from 'constants/colors'
import { PageStatusEnum } from 'model/api/PageStatusEnum'

const StyledInfo = styled(Info)`
  margin-bottom: 24px;
`

export interface DetailInfoProps {
  navigationId: number
  navigationItemId: number
}

export const DetailInfo: React.FC<DetailInfoProps> = ({
  navigationId,
  navigationItemId,
}) => {
  const { t } = useTranslation('navigation-item-variable-mappings')
  const [navigationItem, setNavigationItem] = useState<NavigationItem>()

  const getNavigationItem = useCallback(
    async (cancelToken: CancelToken) => {
      const { data } = await NavigationsItemsApi.getNavigationItem(
        navigationId,
        navigationItemId,
        {
          cancelToken,
        }
      )

      setNavigationItem(data)
    },
    [navigationId, navigationItemId]
  )

  const getItems = useCallback((): InfoItemProps[] => {
    if (!!navigationItem) {
      const { title, path, page } = navigationItem
      return [
        {
          key: 'title',
          label: t('info.title'),
          value: title,
        },
        {
          key: 'path',
          label: t('info.path'),
          value: path ? path : '-',
        },
        {
          key: 'page',
          label: t('info.page'),
          value: page ? page.name : '-',
        },
        {
          key: 'page-status',
          label: t('info.page-status'),
          value: page ? (
            <>
              <Tag color={PAGE_STATUS_COLORS[page.status]}>{page.status}</Tag>
              {page.is_published &&
                page.status !== PageStatusEnum.PUBLISHED && (
                  <Tag color={PAGE_STATUS_COLORS[PageStatusEnum.PUBLISHED]}>
                    {PageStatusEnum.PUBLISHED}
                  </Tag>
                )}
            </>
          ) : (
            '-'
          ),
        },
        {
          key: 'page-path',
          label: t('info.page-path'),
          value: page ? page.path : '-',
        },
        {
          key: 'page-published-path',
          label: t('info.page-published-path'),
          value: page ? page.published_path : '-',
        },
      ]
    } else {
      return []
    }
  }, [navigationItem, t])

  useEffect(() => {
    const cancelTokenSource = axios.CancelToken.source()

    getNavigationItem(cancelTokenSource.token)

    return () => cancelTokenSource.cancel()
  }, [getNavigationItem])

  return <StyledInfo loading={!navigationItem} items={getItems()} />
}
