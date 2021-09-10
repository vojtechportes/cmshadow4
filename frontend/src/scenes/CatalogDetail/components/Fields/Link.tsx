import React, { useCallback } from 'react'
import { CatalogItemDetailField } from 'model/api/CatalogItemDetailField'
import { Input } from 'formik-antd'
import { useFormikContext } from 'formik'
import { CatalogLanguage } from 'model/api/CatalogLanguage'
import { render } from './utils/render'
import { Select, Input as InputAntd, Form } from 'antd'
import { LinkFieldExtraContent } from 'model/api/LinkFieldExtraContent'
import i18next from 'i18next'
import { isFieldValueMultilingual } from 'types/isFieldValueMultilingual'
import { getExtraContentFieldValue } from './utils/getExtraContentFieldValue'
import { getExtraContentFieldName } from './utils/getExtraContentFieldName'
import { FieldGroup } from './styles'

const { Item } = Form

export interface LinkProps {
  field: CatalogItemDetailField
  languages: CatalogLanguage[]
  t: i18next.TFunction
}

export const Link: React.FC<LinkProps> = ({ languages, field, t }) => {
  const { setFieldValue, values } = useFormikContext<any>()
  const { is_multilingual } = field

  const handleFormatChange = useCallback(
    (value: string, name: string) => {
      const extraContent = getExtraContentFieldValue(values, name)

      setFieldValue(getExtraContentFieldName(name), {
        ...extraContent,
        format: value,
      })
    },
    [setFieldValue, values]
  )

  const handleTargetChange = useCallback(
    (value: string, name: string) => {
      const extraContent = getExtraContentFieldValue<LinkFieldExtraContent>(
        values,
        name
      )

      setFieldValue(getExtraContentFieldName(name), {
        ...extraContent,
        target: value,
      })
    },
    [setFieldValue, values]
  )

  const handleRelChange = useCallback(
    (value: string, name: string) => {
      const extraContent = getExtraContentFieldValue<LinkFieldExtraContent>(
        values,
        name
      )

      setFieldValue(getExtraContentFieldName(name), {
        ...extraContent,
        rel: value,
      })
    },
    [setFieldValue, values]
  )

  const renderInput = useCallback(
    (name: string, extraContent: LinkFieldExtraContent | null) => {
      if (extraContent === null) {
        extraContent = {
          rel: '',
          format: 'default',
          target: 'self',
        }

        // TODO set initial field values
      }

      return (
        <>
          <Input name={name} />
          <Form layout="inline">
            <Item label={t('fields.link.target.label')}>
              <Select
                defaultValue={extraContent.target}
                onChange={(value: string) => handleTargetChange(value, name)}
              >
                <Select.Option value="self">
                  {t('fields.link.target.self')}
                </Select.Option>
                <Select.Option value="blank">
                  {t('fields.link.target.blank')}
                </Select.Option>
                <Select.Option value="parent">
                  {t('fields.link.target.parent')}
                </Select.Option>
                <Select.Option value="top">
                  {t('fields.link.target.top')}
                </Select.Option>
              </Select>
            </Item>
            <Item label={t('fields.link.format.label')}>
              <Select
                defaultValue={extraContent.format}
                onChange={(value: string) => handleFormatChange(value, name)}
              >
                <Select.Option value="default">
                  {t('fields.link.format.default')}
                </Select.Option>
                <Select.Option value="tel">
                  {t('fields.link.format.tel')}
                </Select.Option>
                <Select.Option value="mailto">
                  {t('fields.link.format.mailto')}
                </Select.Option>
              </Select>
            </Item>
            <Item label={t('fields.link.rel.label')}>
              <InputAntd
                defaultValue={extraContent.rel}
                onChange={({
                  target: { value },
                }: React.ChangeEvent<HTMLInputElement>) =>
                  handleRelChange(value, name)
                }
              />
            </Item>
          </Form>
        </>
      )
    },
    [t, handleFormatChange, handleTargetChange, handleRelChange]
  )

  if (is_multilingual) {
    return (
      <FieldGroup>
        {languages.map(language => {
          let extraContent: LinkFieldExtraContent | null = null

          if (Object.keys(field.data).length > 0) {
            extraContent = isFieldValueMultilingual(field.data)
              ? field.data[language.code].extra_content
              : null
          }

          return render(
            field,
            (name: string) => renderInput(name, extraContent),
            language
          )
        })}
      </FieldGroup>
    )
  }

  const extraContent: LinkFieldExtraContent | null = !isFieldValueMultilingual(
    field.data
  )
    ? field.data.extra_content
    : null

  return (
    <FieldGroup>
      {render(field, (name: string) => renderInput(name, extraContent))}
    </FieldGroup>
  )
}
