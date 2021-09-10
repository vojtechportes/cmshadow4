import { useContext, useCallback, useRef, useEffect } from 'react'
import { ContentDetailContext } from '..'
import { FormValues } from '../components/DetailForm'
import { PagesApi } from 'api/Pages'
import axios, { CancelTokenSource } from 'axios'
import { notification } from 'antd'
import { useTranslation } from 'react-i18next'
import { FormikHelpers } from 'formik'
import { objectToFormData } from 'object-to-formdata'

export const useSave = () => {
  const {
    page,
    modules,
    files,
    setIsTouched,
    setIsPropertiesTouched,
    pageVersions: { getPageVersions },
  } = useContext(ContentDetailContext)
  const { t } = useTranslation('content-detail')
  const cancelTokenSourceRef = useRef<CancelTokenSource>(
    axios.CancelToken.source()
  )

  useEffect(() => {
    const cancelTokenSource = cancelTokenSourceRef.current

    return () => cancelTokenSource.cancel()
  }, [])

  return useCallback(
    async (values: FormValues, { resetForm }: FormikHelpers<FormValues>) => {
      const {
        html_body_end,
        html_body_start,
        html_head_end,
        meta_canonical,
        meta_description,
        meta_keywords,
        meta_robots,
        meta_title,
        name,
        parent,
        path,
        template_id,
        meta_image,
      } = values

      const formData = new FormData()
      formData.append('html_body_end', html_body_end)
      formData.append('html_body_start', html_body_start)
      formData.append('html_head_end', html_head_end)
      formData.append('meta_description', meta_description)
      formData.append('meta_keywords', meta_keywords)
      formData.append('meta_robots', meta_robots)
      formData.append('meta_title', meta_title)
      formData.append('name', name)
      formData.append('parent', parent)
      formData.append('path', path)
      formData.append('template_id', String(template_id))

      if (!!meta_canonical && meta_canonical !== '') {
        formData.append('meta_canonical', meta_canonical)
      } else {
        formData.append('meta_canonical', '')
      }

      if (!!meta_image && typeof meta_image !== 'string') {
        formData.append('meta_image', meta_image.originFileObj)
      } else {
        formData.append('meta_image', '')
      }

      try {
        const {
          data: { version },
        } = await PagesApi.updatePage(page.identifier, formData, {
          cancelToken: cancelTokenSourceRef.current.token,
        })

        if (Object.keys(modules).length > 0) {
          try {
            const filesData = new FormData()

            if (files && Object.keys(files).length > 0) {
              Object.keys(files).forEach(moduleId => {
                files[moduleId].forEach(file => {
                  filesData.append(`files_${moduleId}`, file.originFileObj)
                })
              })
            }

            const formData = objectToFormData(
              {
                version,
                modules: JSON.stringify(modules),
              },
              {
                nullsAsUndefineds: true,
                booleansAsIntegers: true,
              },
              filesData
            )

            await PagesApi.setPageModules(page.identifier, formData, {
              cancelToken: cancelTokenSourceRef.current.token,
            })
          } catch (e) {
            notification.error({ message: t('save-error') })
          }
        }

        setIsPropertiesTouched(false)
        setIsTouched(false)
        resetForm({ values })
        getPageVersions()

        notification.success({ message: t('save-success') })
      } catch (e) {
        notification.error({ message: t('save-error') })
      }
    },
    [
      modules,
      files,
      page,
      getPageVersions,
      setIsPropertiesTouched,
      setIsTouched,
      t,
    ]
  )
}
