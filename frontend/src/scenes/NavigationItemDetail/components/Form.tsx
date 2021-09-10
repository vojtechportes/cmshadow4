import React, { useCallback, useState, useEffect, useRef } from 'react'
import { Formik } from 'formik'
import { Input, Form as FormFormikAntd, TreeSelect, Select } from 'formik-antd'
import { FormikFormItem as Item } from 'components/FormikFormItem'
import { Button, Form as FormAntd, notification } from 'antd'
import { useTranslation } from 'react-i18next'
import { validateSchema } from 'config/yup'
import * as Yup from 'yup'
import axios, { CancelToken, CancelTokenSource } from 'axios'
import { navigate } from '@reach/router'
import { NavigationItemTargetEnum } from 'model/api/NavigationItemTargetEnum'
import { NavigationsItemsApi } from 'api/NavigationItems'
import { NavigationItem } from 'model/api/NavigationItem'
import { NavigationsApi } from 'api/Navigations'
import {
  mapNavigationItems,
  MappedNavigationItem,
} from 'mappers/mapNavigationItems'
import { PagesApi } from 'api/Pages'
import { mapPages, MappedPage } from 'mappers/mapPages'
import { expandTree } from 'utils/expandTree'

const { Item: ItemAntd } = FormAntd
const { Option } = Select

export interface FormValues {
  parent_id?: number | null
  title?: string
  page_identifier: string | null
  path?: string
  target?: NavigationItemTargetEnum
  html_class_name?: string
  html_id?: string
  weight?: number
}

export const FormSchema = Yup.object().shape<FormValues>({
  parent_id: Yup.number()
    .nullable()
    .notRequired(),
  title: Yup.string().required(),
  page_identifier: Yup.string()
    .nullable()
    .notRequired(),
  path: Yup.string()
    .nullable()
    .notRequired(),
  target: Yup.mixed().required(),
  html_class_name: Yup.string()
    .nullable()
    .notRequired(),
  html_id: Yup.string()
    .nullable()
    .notRequired(),
  weight: Yup.number().required(),
})

export interface FormProps {
  parentId?: number
  navigationId: number
  navigationItemId?: number
  view: 'new' | 'detail'
}

export const Form: React.FC<FormProps> = ({
  parentId,
  navigationId,
  navigationItemId,
  view,
}) => {
  const { PUBLIC_URL } = process.env
  const { t } = useTranslation('navigation-item-detail')
  const [data, setData] = useState<NavigationItem>()
  const [pages, setPages] = useState<MappedPage[]>([])
  const [navigationItems, setNavigationItems] = useState<
    MappedNavigationItem[]
  >([])
  const [loading, setLoading] = useState(false)
  const cancelTokenRef = useRef<CancelTokenSource>(axios.CancelToken.source())
  const formInitialValues = data || {
    parent_id: parentId || undefined,
    title: undefined,
    page_identifier: undefined,
    path: undefined,
    target: NavigationItemTargetEnum.SELF,
    html_class_name: undefined,
    html_id: undefined,
    weight: 50,
  }

  const getNavigationItems = useCallback(
    async (cancelToken: CancelToken) => {
      setLoading(true)
      const {
        data: { items },
      } = await NavigationsApi.getNavigation(navigationId, {
        cancelToken,
      })

      if (!!items) {
        if (view === 'detail') {
          const mappedNavigationItems = mapNavigationItems(items)

          const expandedItems = expandTree<MappedNavigationItem>(
            mappedNavigationItems,
            'children',
            'value',
            Number(navigationItemId),
            { disabled: true },
            true
          )

          setNavigationItems(expandedItems)
        } else {
          setNavigationItems(mapNavigationItems(items))
        }
      }
      setLoading(false)
    },
    [navigationId, view, navigationItemId]
  )

  const getPages = useCallback(async (cancelToken: CancelToken) => {
    setLoading(true)
    const { data } = await PagesApi.getAllPages({
      cancelToken,
    })

    setPages(mapPages(data))
    setLoading(false)
  }, [])

  const getData = useCallback(
    async (cancelToken: CancelToken) => {
      if (view === 'detail' && navigationId && navigationItemId) {
        try {
          setLoading(true)

          const { data } = await NavigationsItemsApi.getNavigationItem(
            navigationId,
            navigationItemId,
            {
              cancelToken,
            }
          )

          setData(data)
          setLoading(false)
        } catch (e) {
          setLoading(false)
        }
      }
    },
    [view, navigationId, navigationItemId]
  )

  const handleSubmit = useCallback(
    async ({
      parent_id,
      title,
      page_identifier,
      path,
      target,
      html_class_name,
      html_id,
      weight,
    }: Required<FormValues>) => {
      try {
        setLoading(true)

        const formData = new FormData()

        formData.append(
          'parent_id',
          parent_id && parent_id !== 0 ? String(parent_id) : ''
        )
        formData.append('title', title)
        formData.append(
          'page_identifier',
          page_identifier ? page_identifier : ''
        )
        formData.append('path', path ? path : '')
        formData.append('target', target)
        formData.append(
          'html_class_name',
          html_class_name ? html_class_name : ''
        )
        formData.append('html_id', html_id ? html_id : '')
        formData.append('weight', String(weight))

        if (view === 'new') {
          await NavigationsItemsApi.createNavigationItem(
            navigationId,
            formData,
            {
              cancelToken: cancelTokenRef.current.token,
            }
          )

          notification.success({ message: t('create-success') })
          navigate(PUBLIC_URL + '/content/modules/navigations/' + navigationId)
        } else if (view === 'detail' && navigationItemId) {
          await NavigationsItemsApi.updateNavigationItem(
            navigationId,
            navigationItemId,
            formData,
            {
              cancelToken: cancelTokenRef.current.token,
            }
          )

          notification.success({ message: t('update-success') })
          navigate(PUBLIC_URL + '/content/modules/navigations/' + navigationId)
        }
      } catch (e) {
        setLoading(false)
      }
    },
    [PUBLIC_URL, view, t, navigationId, navigationItemId]
  )

  const renderForm = useCallback(
    () => (
      <FormFormikAntd layout="vertical">
        <Item label={t('form.parent-id')} name="parent_id">
          {navigationItems && !loading ? (
            <TreeSelect
              treeData={navigationItems}
              name="parent_id"
              allowClear
              showArrow
              showSearch
              filterTreeNode
              treeDefaultExpandAll
              treeNodeFilterProp="title"
            />
          ) : (
            <Input name="parent_id" disabled />
          )}
        </Item>
        <Item label={t('form.title')} name="title">
          <Input name="title" />
        </Item>
        <Item label={t('form.page-identifier')} name="page_identifier">
          {pages && !loading ? (
            <TreeSelect
              treeData={pages}
              name="page_identifier"
              allowClear
              showArrow
              showSearch
              filterTreeNode
              treeDefaultExpandAll
              treeNodeFilterProp="title"
            />
          ) : (
            <Input name="page_identifier" disabled />
          )}
        </Item>
        <Item label={t('form.path')} name="path">
          <Input name="path" />
        </Item>
        <Item label={t('form.target')} name="target">
          <Select name="target">
            {Object.values(NavigationItemTargetEnum).map(value => (
              <Option value={value} key={value}>
                {value}
              </Option>
            ))}
          </Select>
        </Item>
        <Item label={t('form.html-class-name')} name="html_class_name">
          <Input name="html_class_name" />
        </Item>
        <Item label={t('form.html-id')} name="html_id">
          <Input name="html_id" />
        </Item>
        <Item label={t('form.weight')} name="weight">
          <Input name="weight" type="number" />
        </Item>
        <ItemAntd>
          <Button
            htmlType="submit"
            type="primary"
            size="large"
            disabled={loading}
          >
            {t(view === 'new' ? 'form.submit.new' : 'form.submit.detail')}
          </Button>
        </ItemAntd>
      </FormFormikAntd>
    ),
    [t, view, loading, navigationItems, pages]
  )

  useEffect(() => {
    const cancelTokenSource = axios.CancelToken.source()

    getData(cancelTokenSource.token)
    getNavigationItems(cancelTokenSource.token)
    getPages(cancelTokenSource.token)

    return () => cancelTokenSource.cancel()
  }, [getData, getNavigationItems, getPages])

  useEffect(() => {
    const cancelToken = cancelTokenRef.current

    return () => cancelToken.cancel()
  }, [])

  return (
    <Formik<FormValues>
      initialValues={formInitialValues}
      enableReinitialize
      validate={values => validateSchema(values, FormSchema)}
      onSubmit={handleSubmit}
    >
      {() => renderForm()}
    </Formik>
  )
}
