import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { Tabs, Button } from 'antd'
import { Page } from 'model/api/Page'
import { Editor } from '../components/Editor'
import { COLORS } from 'constants/colors'
import { IconButton } from 'components/IconButton'
import { Properties } from '../components/Properties'
import { Formik } from 'formik'
import { validateSchema } from 'config/yup'
import * as Yup from 'yup'
import { useGetPropertiesInitialValues } from '../hooks/useGetPropertiesInitialValues'
import { ContentDetailContext } from '..'
import { Form as FormFormikAntd } from 'formik-antd'
import { useSave } from '../hooks/useSave'
import { Versions } from './Versions'
import { PageStatusEnum } from 'model/api/PageStatusEnum'
import { UploadFile } from 'antd/es/upload/interface'

const { TabPane } = Tabs
const { Group } = Button

export enum ContentTabsEnum {
  EDITOR = 'Editor',
  PROPERTIES = 'Properties',
  VERSIONS = 'Versions',
}

export interface FormValues
  extends Partial<
    Pick<
      Page,
      | 'name'
      | 'parent'
      | 'template_id'
      | 'path'
      | 'meta_title'
      | 'meta_description'
      | 'meta_keywords'
      | 'meta_robots'
      | 'meta_canonical'
      | 'html_head_end'
      | 'html_body_start'
      | 'html_body_end'
    >
  > {
  meta_image: string | UploadFile<any> | undefined
}

export const FormSchema = Yup.object().shape<FormValues>({
  name: Yup.string().required(),
  path: Yup.string().required(), // TODO local path validation
  parent: Yup.string().notRequired(),
  template_id: Yup.number().required(),
  meta_image: Yup.mixed().notRequired(),
  meta_title: Yup.string().notRequired(),
  meta_robots: Yup.mixed().required(),
  html_body_end: Yup.string().notRequired(),
  html_body_start: Yup.string().notRequired(),
  html_head_end: Yup.string().notRequired(),
  meta_canonical: Yup.string()
    .nullable()
    .notRequired(),
  meta_description: Yup.string().notRequired(),
  meta_keywords: Yup.string().notRequired(),
})

export const DetailForm: React.FC = () => {
  const { t } = useTranslation('content-detail')
  const formInitialValues = useGetPropertiesInitialValues()
  const { isTouched, isPropertiesTouched, page, loading } = useContext(
    ContentDetailContext
  )
  const handleSubmit = useSave()

  return (
    <Formik<FormValues>
      initialValues={formInitialValues}
      enableReinitialize
      validate={values => validateSchema(values, FormSchema)}
      onSubmit={handleSubmit}
    >
      {props => (
        <FormFormikAntd layout="vertical">
          <Tabs
            defaultActiveKey={ContentTabsEnum.EDITOR}
            tabBarExtraContent={
              <Group>
                <IconButton
                  size="middle"
                  icon="save"
                  disabled={
                    (!isTouched && !isPropertiesTouched) || props.isSubmitting
                  }
                  type="primary"
                  color={COLORS.green2}
                  htmlType="submit"
                >
                  {t('save')}
                </IconButton>
                <IconButton
                  size="middle"
                  icon="cloud-upload-alt"
                  htmlType="button"
                  disabled={page && page.status === PageStatusEnum.PUBLISHED}
                >
                  {t('publish')}
                </IconButton>
              </Group>
            }
          >
            <TabPane
              key={ContentTabsEnum.EDITOR}
              tab={t('tabs.editor')}
              disabled={loading}
            >
              <Editor />
            </TabPane>
            <TabPane
              key={ContentTabsEnum.PROPERTIES}
              tab={t('tabs.properties')}
              disabled={loading}
            >
              <Properties />
            </TabPane>
            <TabPane
              key={ContentTabsEnum.VERSIONS}
              tab={t('tabs.versions')}
              disabled={loading}
            >
              <Versions />
            </TabPane>
          </Tabs>
        </FormFormikAntd>
      )}
    </Formik>
  )
}
