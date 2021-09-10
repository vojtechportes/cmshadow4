import React, { useContext, useEffect, useCallback, useState } from 'react'
import { RouteComponentProps, navigate } from '@reach/router'
import { useTranslation } from 'react-i18next'
import { Space } from 'antd'
import { IconButton } from 'components/IconButton'
import { SceneTitle } from 'components/SceneTitle'
import { AuthenticatedLayoutContext } from 'components/Layout/AuthenticatedLayout'
import { Table } from './components/Table'
import {
  Filters,
  filtersInitialValues,
  SubmittedFilterValues,
} from './components/Filters'

export const Catalog: React.FC<RouteComponentProps> = () => {
  const { PUBLIC_URL } = process.env
  const [filters, setFilters] = useState<SubmittedFilterValues>(
    (filtersInitialValues as unknown) as SubmittedFilterValues
  )
  const { t } = useTranslation('catalog')
  const { setSceneTitle } = useContext(AuthenticatedLayoutContext)

  const handleCreateCatalogItem = useCallback(() => {
    navigate(PUBLIC_URL + '/catalog/new')
  }, [PUBLIC_URL])

  useEffect(() => {
    setSceneTitle(<SceneTitle title={t('scene-title')} />)
  }, [setSceneTitle, t])

  return (
    <Space size="large" direction="vertical" style={{ width: '100%' }}>
      <IconButton
        size="middle"
        type="primary"
        icon="plus"
        onClick={handleCreateCatalogItem}
      >
        {t('create-new-catalog-item')}
      </IconButton>
      <Filters
        onSubmit={values => {
          setFilters(values)
        }}
      />
      <Table filters={filters} />
    </Space>
  )
}
