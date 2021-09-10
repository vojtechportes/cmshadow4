import React from 'react'
import { CatalogItemDetailField } from 'model/api/CatalogItemDetailField'
import { DatePicker } from 'formik-antd'
import { CatalogLanguage } from 'model/api/CatalogLanguage'
import { render } from './utils/render'
import { DATEPICKER_DATE_TIME_FORMAT } from 'constants/date'
import { MultiLingual } from './styles'

export interface DateTimeProps {
  field: CatalogItemDetailField
  languages: CatalogLanguage[]
}

export const DateTime: React.FC<DateTimeProps> = ({ languages, field }) => {
  const { is_multilingual } = field
  const timeFormat = { format: 'HH:mm' }

  if (is_multilingual) {
    return (
      <MultiLingual>
        {languages.map(language =>
          render(
            field,
            (name: string) => (
              <DatePicker
                format={DATEPICKER_DATE_TIME_FORMAT}
                name={name}
                showTime={timeFormat}
              />
            ),
            language
          )
        )}
      </MultiLingual>
    )
  }

  return render(field, (name: string) => (
    <DatePicker
      format={DATEPICKER_DATE_TIME_FORMAT}
      name={name}
      showTime={timeFormat}
    />
  ))
}
