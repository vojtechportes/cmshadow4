import React from 'react'
import { Table as TableBase } from 'antd'
import { TableProps as TablePropsBase } from 'antd/es/table'

export interface TableProps<T> extends TablePropsBase<T> {
  isScrollable?: boolean
}

export const Table: React.FC<TableProps<any>> = ({
  columns,
  dataSource,
  loading,
  pagination,
  isScrollable = false,
  ...rest
}) => {
  const scrollableWidth = columns.reduce(
    (accumulator: number, currentValue) =>
      accumulator + parseInt(String(currentValue.width), 10),
    0
  )

  return (
    <TableBase
      columns={columns}
      dataSource={dataSource}
      loading={loading}
      pagination={pagination}
      scroll={{ x: isScrollable ? scrollableWidth : undefined }}
      tableLayout="fixed"
      {...rest}
    />
  )
}
