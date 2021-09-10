import React from 'react'
import { CatalogItemDetailField } from 'model/api/CatalogItemDetailField'
import { InputNumber } from 'formik-antd'
import { CatalogLanguage } from 'model/api/CatalogLanguage'
import { render } from './utils/render'
import { MultiLingual } from './styles'

export interface IntegerProps {
  field: CatalogItemDetailField
  languages: CatalogLanguage[]
}

export const Integer: React.FC<IntegerProps> = ({ languages, field }) => {
  const { is_multilingual } = field

  if (is_multilingual) {
    return (
      <MultiLingual>
        {languages.map(language =>
          render(field, (name: string) => <InputNumber name={name} />, language)
        )}
      </MultiLingual>
    )
  }

  return render(field, (name: string) => <InputNumber name={name} />)
}
