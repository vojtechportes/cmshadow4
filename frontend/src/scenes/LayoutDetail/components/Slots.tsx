import React, { useCallback, useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import axios, { CancelTokenSource } from 'axios'
import { LayoutSlotsApi } from 'api/LayoutSlots'
import { LayoutSlot } from 'model/api/LayoutSlot'
import styled from 'styled-components'
import { COLORS } from 'constants/colors'
import { Skeleton, Space, Alert, Button, notification } from 'antd'
import { IconButton } from 'components/IconButton'
import { SlotModal } from './SlotModal'
import { Dialog, DialogContainer } from 'components/Dialog'
import { Icon } from 'components/Icon'

const StyledDialog = styled(Dialog)`
  && {
    position: absolute;
  }
`

const Slot = styled.div`
  margin-top: 12px;
  padding: 24px;
  border: 1px solid ${COLORS.gray2};
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.1);
`

const Container = styled.div<{ hasChildren: boolean }>`
  display: grid;
  grid-template-columns: auto max-content;
  margin-bottom: ${({ hasChildren }) => hasChildren && `24px`};
`

const StyledIcon = styled(Icon)`
  margin-left: 6px;
`

export interface SlotsProps {
  layoutId: number
}

export const Slots: React.FC<SlotsProps> = ({ layoutId }) => {
  const { t } = useTranslation('layout-detail')
  const [data, setData] = useState<LayoutSlot[]>([])
  const [loading, setLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalData, setModalData] = useState<{
    parentId?: number
    slotId?: number
  }>({ parentId: undefined, slotId: undefined })
  const [dialogActiveItem, setDialogActiveItem] = useState<number>()
  const cancelTokenRef = useRef<CancelTokenSource>(axios.CancelToken.source())

  const getData = useCallback(async () => {
    try {
      setLoading(true)
      const { data } = await LayoutSlotsApi.getLayoutSlots(layoutId, {
        cancelToken: cancelTokenRef.current.token,
      })

      setData(data)
      setLoading(false)
    } catch (e) {
      setLoading(false)
    }
  }, [layoutId])

  const handleDelete = useCallback(
    async (slotId: number) => {
      try {
        await LayoutSlotsApi.deleteLayoutSlot(slotId, {
          cancelToken: cancelTokenRef.current.token,
        })

        getData()

        notification.success({ message: t('slots.delete-success') })
      } catch (e) {}
    },
    [getData, t]
  )

  const renderSlots = useCallback(
    (slots: LayoutSlot[]) =>
      slots.map(({ id, name, children, locked }, index) => (
        <Slot key={id}>
          <Container hasChildren={!!children}>
            <span>
              {name}
              {locked ? <StyledIcon icon="lock" size="sm" /> : null}
            </span>
            <Space direction="horizontal" size="small">
              <IconButton
                icon="plus"
                size="small"
                onClick={() => {
                  setModalData({ parentId: id })
                  setIsModalOpen(true)
                }}
              >
                {t('slots.add')}
              </IconButton>
              <Button
                size="small"
                onClick={() => {
                  setModalData({ slotId: id })
                  setIsModalOpen(true)
                }}
              >
                {t('slots.edit')}
              </Button>

              <DialogContainer
                top={
                  data.length === 1 || index + 1 === data.length
                    ? '-115px'
                    : '10px'
                }
                left={`calc(-100% - 175px)`}
              >
                <Button
                  size="small"
                  type="danger"
                  ghost
                  onClick={() => setDialogActiveItem(id)}
                >
                  {t('slots.delete')}
                </Button>

                {dialogActiveItem === id && (
                  <StyledDialog
                    onConfirm={() => handleDelete(id)}
                    onCancel={() => setDialogActiveItem(undefined)}
                    confirm={t('slots.dialog.confirm')}
                    cancel={t('slots.dialog.cancel')}
                    text={t('slots.dialog.text')}
                  />
                )}
              </DialogContainer>
            </Space>
          </Container>
          {children && renderSlots(children)}
        </Slot>
      )),
    [dialogActiveItem, data.length, handleDelete, t]
  )

  const handleSave = useCallback(
    (view: 'new' | 'detail') => {
      getData()
      setIsModalOpen(false)
      setModalData({ parentId: undefined, slotId: undefined })

      if (view === 'new') {
        notification.success({ message: t('slots.create-success') })
      } else {
        notification.success({ message: t('slots.update-success') })
      }
    },
    [getData, t]
  )

  useEffect(() => {
    getData()
  }, [getData])

  useEffect(() => {
    const cancelTokenSource = cancelTokenRef.current

    return () => cancelTokenSource.cancel()
  }, [])

  if (loading) {
    return <Skeleton active loading paragraph={{ rows: 4, width: '100%' }} />
  }

  if (data) {
    if (data.length > 0) {
      return (
        <>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <IconButton
              size="middle"
              type="primary"
              icon="plus"
              onClick={() => setIsModalOpen(true)}
            >
              {t('slots.create-new-slot')}
            </IconButton>
            <div>{renderSlots(data)}</div>
          </Space>
          {isModalOpen && (
            <SlotModal
              view={modalData.slotId ? 'detail' : 'new'}
              layoutId={layoutId}
              parentId={modalData.parentId}
              slotId={modalData.slotId}
              onClose={() => setIsModalOpen(false)}
              onSave={handleSave}
            />
          )}
        </>
      )
    } else {
      return (
        <>
          <Alert
            type="warning"
            message={
              <Space direction="vertical" size="middle">
                <div>{t('slots.no-slots')}</div>

                <IconButton
                  size="middle"
                  type="primary"
                  icon="plus"
                  onClick={() => setIsModalOpen(true)}
                >
                  {t('slots.create-new-slot')}
                </IconButton>
              </Space>
            }
          />
          {isModalOpen && (
            <SlotModal
              view="new"
              layoutId={layoutId}
              onClose={() => setIsModalOpen(false)}
              onSave={handleSave}
            />
          )}
        </>
      )
    }
  }

  return null
}
