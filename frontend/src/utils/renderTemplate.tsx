import { renderToString } from 'react-dom/server'
import parser from "html-react-parser"

/**
 * 
 * @param template 
 */
export const renderTemplate = (template: string) =>
  renderToString(parser(template) as React.ReactElement)
    .replace('"{', '{')
    .replace('}"', '}')
