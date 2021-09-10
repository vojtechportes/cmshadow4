import React from 'react'
import JSXParserBase, { JsxParserProps } from '@vojtechportes/react-jsx-parser'

const block = (cb: any) => cb()

export const iterator = (
  items: any[],
  renderItem: (item: any, renderItem: any) => any
) => {
  return items.map(item => {
    return renderItem(item, renderItem)
  })
}

export const JSXParser: React.FC<JsxParserProps> = ({ bindings, ...rest }) => (
  <JSXParserBase
    bindings={{
      ...bindings,
      iterator,
      JSON,
      Object,
      Array,
      Number,
      String,
      console,
      block
    }}
    {...rest}
  />
)
