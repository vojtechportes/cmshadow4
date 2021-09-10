import { Modal, Space } from 'antd'
import React, { useCallback, useState, useRef, useEffect } from 'react'
import * as Yup from 'yup'
import { Formik } from 'formik'
import { Switch, Select, Input, Form as FormFormikAntd } from 'formik-antd'
import { FormikFormItem as Item } from 'components/FormikFormItem'
import { Button, Form as FormAntd } from 'antd'
import { useTranslation } from 'react-i18next'
import { validateSchema } from 'config/yup'
import axios, { CancelToken, CancelTokenSource } from 'axios'
import { LayoutSlotsApi } from 'api/LayoutSlots'
import { MappedLayoutSlot, mapLayoutSlot } from '../utils/mapLayoutSlot'
import { LayoutSlot } from 'model/api/LayoutSlot'

const { Item: ItemAntd } = FormAntd
const { Option } = Select

export interface SlotModalProps {
  parentId?: number // For creating sub-ordinated slot
  slotId?: number // Editing
  layoutId: number
  view: 'new' | 'detail'
  onClose: () => void
  onSave?: (view: 'new' | 'detail') => void
}

export interface FormValues {
  parent_id?: number | null
  name?: string
  writeable?: boolean
  locked?: boolean
  weight?: number
  html_class_name?: string
  html_id?: string
}

export const FormSchema = Yup.object().shape<FormValues>({
  parent_id: Yup.number()
    .nullable()
    .notRequired(),
  name: Yup.string().required(),
  writeable: Yup.boolean().notRequired(),
  locked: Yup.boolean().notRequired(),
  weight: Yup.number().required(),
  html_class_name: Yup.string().notRequired(),
  html_id: Yup.string().notRequired(),
})

export const SlotModal: React.FC<SlotModalProps> = ({
  view,
  layoutId,
  parentId,
  slotId,
  onClose,
  onSave,
}) => {
  const { t } = useTranslation('layout-detail')
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<MappedLayoutSlot>()
  const [layoutSlots, setLayoutSlots] = useState<LayoutSlot[]>([])
  const cancelTokenRef = useRef<CancelTokenSource>(axios.CancelToken.source())

  const getLayoutSlots = useCallback(
    async (cancelToken: CancelToken) => {
      try {
        setLoading(true)

        const { data } = await LayoutSlotsApi.getAllLayoutSlots(layoutId, {
          cancelToken,
        })

        setLayoutSlots(data)
        setLoading(false)
      } catch (e) {
        setLoading(false)
      }
    },
    [layoutId]
  )

  const getData = useCallback(
    async (cancelToken: CancelToken) => {
      if (view === 'detail' && slotId) {
        try {
          setLoading(true)

          const { data } = await LayoutSlotsApi.getLayoutSlot(slotId, {
            cancelToken,
          })

          setData(mapLayoutSlot(data))
          setLoading(false)
        } catch (e) {
          setLoading(false)
        }
      }
    },
    [view, slotId]
  )

  const getInitialValues = useCallback((): FormValues => {
    if (data) {
      return {
        ...data,
        parent_id: data.parent_id || 0,
      }
    } else {
      return {
        parent_id: parentId || 0,
        name: undefined,
        weight: 50,
        locked: false,
        writeable: false,
        html_class_name: '',
        html_id: '',
      }
    }
  }, [data, parentId])

  const handleSubmit = useCallback(
    async ({
      name,
      writeable,
      locked,
      weight,
      html_class_name,
      html_id,
    }: Required<FormValues>) => {
      const cancelToken = cancelTokenRef.current.token

      const formData = new FormData()
      formData.append('name', name)
      formData.append('writeable', String(+writeable))
      formData.append('locked', String(+locked))
      formData.append('weight', String(weight))
      formData.append('html_class_name', html_class_name)
      formData.append('html_id', html_id)

      formData.append('layout_id', String(layoutId))

      if (!!parentId) {
        formData.append('parent_id', String(parentId))
      }

      if (view === 'new') {
        try {
          await LayoutSlotsApi.createLayoutSlot(formData, {
            cancelToken,
          })

          onSave(view)
        } catch (e) {}
      } else if (view === 'detail' && slotId) {
        try {
          await LayoutSlotsApi.updateLayoutSlot(slotId, formData, {
            cancelToken,
          })

          onSave(view)
        } catch (e) {}
      }
    },
    [view, layoutId, parentId, onSave, slotId]
  )

  const renderForm = useCallback(
    () => (
      <FormFormikAntd layout="vertical">
        <Item label={t('slot-modal.form.parent-id.label')} name="parent_id">
          <Select name="parent_id" loading={loading}>
            <Option value={0}>{t('slot-modal.form.parent-id.root')}</Option>
            {layoutSlots.map(({ name, id }) => (
              <Option value={id}>
                <em>(id: {id})</em> {name}
              </Option>
            ))}
          </Select>
        </Item>
        <Item label={t('slot-modal.form.name')} name="name">
          <Input name="name" />
        </Item>
        <Item label={t('slot-modal.form.writeable')} name="writeable">
          <Switch name="writeable" />
        </Item>
        <Item label={t('slot-modal.form.locked')} name="locked">
          <Switch name="locked" />
        </Item>
        <Item label={t('slot-modal.form.weight')} name="weight">
          <Input name="weight" type="number" />
        </Item>
        <Item
          label={t('slot-modal.form.html-class-name')}
          name="html_class_name"
        >
          <Input name="html_class_name" />
        </Item>
        <Item label={t('slot-modal.form.html-id')} name="html_id">
          <Input name="html_id" />
        </Item>
        <ItemAntd>
          <Space direction="horizontal" size="middle">
            <Button
              htmlType="submit"
              type="primary"
              size="large"
              disabled={loading}
            >
              {t(
                view === 'new'
                  ? 'slot-modal.form.submit.new'
                  : 'slot-modal.form.submit.detail'
              )}
            </Button>
            <Button
              type="default"
              htmlType="button"
              onClick={onClose}
              size="large"
            >
              {t('slot-modal.form.close')}
            </Button>
          </Space>
        </ItemAntd>
      </FormFormikAntd>
    ),
    [t, view, loading, onClose, layoutSlots]
  )

  useEffect(() => {
    const cancelTokenSource = axios.CancelToken.source()

    getData(cancelTokenSource.token)
    getLayoutSlots(cancelTokenSource.token)

    return () => cancelTokenSource.cancel()
  }, [getData, getLayoutSlots])

  return (
    <Modal visible footer={null} closable={false}>
      <Formik<FormValues>
        initialValues={getInitialValues()}
        enableReinitialize
        validate={values => validateSchema(values, FormSchema)}
        onSubmit={handleSubmit}
      >
        {() => renderForm()}
      </Formik>
    </Modal>
  )
}
