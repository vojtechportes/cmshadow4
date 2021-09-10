import React, { useCallback } from 'react'
import { Info as BaseInfo, InfoItemProps } from 'components/Info'
import { RichTextFormik } from 'components/RichTextFormik'
import { Formik, Form } from 'formik'
import { OrderDetail } from 'model/api/OrderDetail'
import { Typography, Tag, Button, notification, Space } from 'antd'
import { useTranslation } from 'react-i18next'
import { DATE_TIME_FORMAT } from 'constants/date'
import { format } from 'date-fns'
import { ORDERS_STATUS_COLORS } from 'constants/colors'
import { navigate } from '@reach/router'
import { OrdersApi } from 'api/Orders'

const { Title } = Typography

export interface InfoProps {
  data: OrderDetail
}

export interface FormValues {
  private_note: string
}

export const Info: React.FC<InfoProps> = ({
  data: { id, created_at, modified_at, private_note, status },
}) => {
  const { t } = useTranslation('order-detail')
  const { PUBLIC_URL } = process.env

  const formInitialValues: FormValues = {
    private_note,
  }

  const items: InfoItemProps[] = [
    {
      key: 'id',
      label: t('info.id'),
      value: id,
    },
    {
      key: 'created_at',
      label: t('info.created-at'),
      value: format(new Date(created_at), DATE_TIME_FORMAT),
    },
    {
      key: 'modified_at',
      label: t('info.modified-at'),
      value: created_at ? format(new Date(modified_at), DATE_TIME_FORMAT) : '-',
    },
    {
      key: 'status',
      label: t('info.status'),
      value: <Tag color={ORDERS_STATUS_COLORS[status]}>{status}</Tag>,
    },
    {
      key: 'private-note',
      label: t('info.private-note'),
      value: (
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <RichTextFormik
            name="private_note"
            init={{
              height: 250,
              toolbar: `undo redo | formatselect |
               | bold italic backcolor | alignleft aligncenter 
               alignright alignjustify | bullist numlist outdent indent | removeformat `,
              entity_encoding: 'raw',
              paste_as_text: true,
            }}
          />
          <Button htmlType="submit">{t('save')}</Button>
        </Space>
      ),
      span: '1 / span 2',
    },
  ]

  const handleSubmit = useCallback(
    async (values: FormValues) => {
      try {
        const formData = new FormData()
        formData.append('private_note', values.private_note)

        await OrdersApi.changeOrderNote(id, formData)

        notification.success({ message: t('note-save-success') })

        const to = PUBLIC_URL + '/orders/' + id

        navigate(PUBLIC_URL + '/redirect-to', {
          state: {
            to,
          },
        })
      } catch (e) {
        notification.error({ message: t('note-save-error') })
      }
    },
    [id, t]
  )

  return (
    <>
      <Title level={4}>{t('info.title')}</Title>
      <Formik<FormValues>
        onSubmit={handleSubmit}
        initialValues={formInitialValues}
      >
        <Form>
          <BaseInfo items={items} columns={2} />
        </Form>
      </Formik>
    </>
  )
}
