import React from 'react'
import { Input } from 'formik-antd'
import { FormikFormItem as Item } from 'components/FormikFormItem'
import { useTranslation } from 'react-i18next'

const { TextArea } = Input

export const Advanced: React.FC = () => {
  const { t } = useTranslation('content-detail')

  return (
    <>
      <Item label={t('properties.advanced.html-head-end')} name="html_head_end">
        <TextArea name="html_head_end" rows={5} />
      </Item>
      <Item label={t('properties.advanced.html-body-start')} name="html_body_start">
        <TextArea name="html_body_start" rows={5} />
      </Item>
      <Item label={t('properties.advanced.html-body-end')} name="html_body_end">
        <TextArea name="html_body_end" rows={5} />
      </Item>
    </>
  )
}
