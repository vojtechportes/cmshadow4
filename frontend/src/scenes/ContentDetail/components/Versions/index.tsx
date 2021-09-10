import React, { useContext, useCallback, useEffect, useMemo } from 'react'
import { ContentDetailContext } from 'scenes/ContentDetail'
import { getPageVersionsColumns } from 'scenes/ContentDetail/utils/getPageVersionsColumns'
import { useTranslation } from 'react-i18next'
import { DropdownAction } from './Dropdown'
import { Table } from 'components/Table'

export const Versions: React.FC = () => {
  const { t } = useTranslation('content-detail')
  const {
    pageVersions: {
      data,
      loading,
      page,
      setPage,
      pageSize,
      total,
      getPageVersions,
    },
  } = useContext(ContentDetailContext)

  const handleActionClick = useCallback(
    async (action: DropdownAction, _identifier: string) => {
      switch (action) {
        case 'preview':
          // TODO
          break
        case 'revert':
          // TODO
          break
        default:
          break
      }
    },
    []
  )

  const handlePageChange = useCallback(
    (page: number) => {
      setPage(page)
    },
    [setPage]
  )

  useEffect(() => {
    getPageVersions()
  }, [getPageVersions])

  return useMemo(
    () => (
      <Table
        columns={getPageVersionsColumns(t, handleActionClick)}
        dataSource={data}
        loading={loading}
        isScrollable
        pagination={{
          current: page,
          pageSize,
          total,
          onChange: handlePageChange,
        }}
      />
    ),
    [
      data,
      loading,
      page,
      pageSize,
      total,
      t,
      handleActionClick,
      handlePageChange,
    ]
  )
}
