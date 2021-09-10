import React from 'react'
import { CatalogItemDetailField } from 'model/api/CatalogItemDetailField'
import { DatePicker } from 'formik-antd'
import { CatalogLanguage } from 'model/api/CatalogLanguage'
import { render } from './utils/render'
import { DATEPICKER_DATE_FORMAT } from 'constants/date'
import { MultiLingual } from './styles'

export interface DateProps {
  field: CatalogItemDetailField
  languages: CatalogLanguage[]
}

export const Date: React.FC<DateProps> = ({ languages, field }) => {
  const { is_multilingual } = field

  if (is_multilingual) {
    return (
      <MultiLingual>
        {languages.map(language =>
          render(
            field,
            (name: string) => (
              <DatePicker format={DATEPICKER_DATE_FORMAT} name={name} />
            ),
            language
          )
        )}
      </MultiLingual>
    )
  }

  return render(field, (name: string) => (
    <DatePicker format={DATEPICKER_DATE_FORMAT} name={name} />
  ))
}
