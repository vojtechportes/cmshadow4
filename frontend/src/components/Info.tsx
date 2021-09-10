import React from 'react'
import styled from 'styled-components'
import { COLORS } from 'constants/colors'
import { Skeleton } from 'antd'

const Container = styled.div<{ columns: number }>`
  display: grid;
  grid-gap: 24px 12px;
  grid-template-columns: ${({ columns }) =>
    columns && `repeat(${columns}, 1fr)`};
  padding: 24px;
  border: 1px solid ${COLORS.gray2};
  border-radius: 2px;
`

const Item = styled.div<{ span: string }>`
  grid-column: ${({ span }) => span && span};
`

const Label = styled.div`
  margin-bottom: 8px;
  font-weight: 600;
`

export interface InfoItemProps {
  key: string
  label: string
  value: React.ReactNode | React.ReactNodeArray
  span?: string
}

export interface InfoProps {
  items: InfoItemProps[]
  columns?: number
  loading?: boolean
  className?: string
}

export const Info: React.FC<InfoProps> = ({
  items,
  columns = 4,
  loading = false,
  className,
}) => {
  return (
    <Container columns={columns} className={className}>
      {loading ? (
        <Skeleton active loading paragraph={{ rows: 4, width: '100%' }} />
      ) : (
        <>
          {items.map(({ label, value, span, key }) => (
            <Item span={span} key={key}>
              <Label>{label}</Label>
              {value}
            </Item>
          ))}
        </>
      )}
    </Container>
  )
}
