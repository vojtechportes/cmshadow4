import React from 'react'
import { FormikFormItem as Item } from 'components/FormikFormItem'
import { CatalogItemDetailField } from 'model/api/CatalogItemDetailField'
import { CatalogLanguage } from 'model/api/CatalogLanguage'

export const render = (
  field: CatalogItemDetailField,
  renderChildren: (name: string) => React.ReactNode,
  language?: CatalogLanguage
) => {
  const { name, id } = field

  let label = name

  if (language) {
    label = `${name} (${language.name})`
  }

  const fieldName = `fields[${id}]${!!language ? `[${language.code}][value]` : '[value]'}`

  return (
    <Item label={label} name={fieldName} key={fieldName}>
      {renderChildren(fieldName)}
    </Item>
  )
}
