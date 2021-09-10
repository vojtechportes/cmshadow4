import React, { useContext } from 'react'
import { Input, Select, TreeSelect } from 'formik-antd'
import { FormikFormItem as Item } from 'components/FormikFormItem'
import { useTranslation } from 'react-i18next'
import { useGetPropertiesData } from '../../hooks/useGetPropertiesData'
import { ContentDetailContext } from '../../'

const { Option } = Select

export const General: React.FC = () => {
  const { t } = useTranslation('content-detail')
  const { loading: contentDetailLoading } = useContext(ContentDetailContext)
  const { templates, pages, loading: propsDataLoading } = useGetPropertiesData()

  const loading = contentDetailLoading || propsDataLoading

  return (
    <>
      <Item label={t('properties.general.template-id')} name="template_id">
        <Select name="template_id" loading={loading}>
          {templates.map(({ id, name }) => (
            <Option value={id} key={id}>
              {name}
            </Option>
          ))}
        </Select>
      </Item>
      <Item label={t('properties.general.parent')} name="parent">
        {pages && !propsDataLoading ? (
          <TreeSelect
            treeData={pages}
            name="parent"
            allowClear
            showArrow
            showSearch
            filterTreeNode
            treeDefaultExpandAll
            treeNodeFilterProp="title"
          />
        ) : (
          <Input name="parent" disabled />
        )}
      </Item>
      <Item label={t('properties.general.name')} name="name">
        <Input name="name" />
      </Item>
      <Item label={t('properties.general.path')} name="path">
        <Input name="path" />
      </Item>
    </>
  )
}
