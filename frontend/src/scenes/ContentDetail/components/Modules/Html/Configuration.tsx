import React, { useCallback, useState, useEffect } from 'react'
import { Modal } from 'antd'
import { useTranslation } from 'react-i18next'
import { HtmlDataProps } from 'scenes/ContentDetail/types/Module'
import Editor from 'react-simple-code-editor'
import { highlight, languages } from 'prismjs/components/prism-core'
import 'prismjs/components/prism-clike'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-markup'
import 'prismjs/components/prism-jsx'
import { editorStyle } from 'components/CodeEditorFormik'
import styled from 'styled-components'
import { COLORS } from 'constants/colors'

const StyledCodeEditor = styled(Editor)`
  min-height: 300px;
  padding: 1rem;
  font-size: 12px;
  font-family: "Fira code", "Fira Mono", monospace;
  background: ${COLORS.gray2};
  border: 1px solid ${COLORS.gray4};

  .token.comment,
  .token.prolog,
  .token.doctype,
  .token.cdata {
    color: #90a4ae;
  }
  .token.punctuation {
    color: #9e9e9e;
  }
  .namespace {
    opacity: 0.7;
  }
  .token.property,
  .token.tag,
  .token.boolean,
  .token.number,
  .token.constant,
  .token.symbol,
  .token.deleted {
    color: #e91e63;
  }
  .token.selector,
  .token.attr-name,
  .token.string,
  .token.char,
  .token.builtin,
  .token.inserted {
    color: #4caf50;
  }
  .token.operator,
  .token.entity,
  .token.url,
  .language-css .token.string,
  .style .token.string {
    color: #795548;
  }
  .token.atrule,
  .token.attr-value,
  .token.keyword {
    color: #3f51b5;
  }
  .token.function {
    color: #f44336;
  }
  .token.regex,
  .token.important,
  .token.variable {
    color: #ff9800;
  }
  .token.important,
  .token.bold {
    font-weight: bold;
  }
  .token.italic {
    font-style: italic;
  }
  .token.entity {
    cursor: help;
  }
`

export type Data = HtmlDataProps

export interface ConfigurationProps {
  data: Data
  onConfirm: (data: Data) => void
  onCancel: () => void
}

export const Configuration: React.FC<ConfigurationProps> = ({
  data,
  onConfirm,
  onCancel,
}) => {
  const { t } = useTranslation('content-detail')
  const [configuration, setConfiguration] = useState(data)

  const handleConfirm = useCallback(() => {
    onConfirm(configuration)
  }, [onConfirm, configuration])

  const handleCodeEditorChange = useCallback((content: string) => {
    setConfiguration(value => ({
      ...value,
      content,
    }))
  }, [setConfiguration])

  return (
    <Modal
      visible
      width={600}
      onOk={handleConfirm}
      onCancel={onCancel}
      title={t('html-configuration.title')}
    >
      <StyledCodeEditor
        value={configuration.content}
        onValueChange={handleCodeEditorChange}
        highlight={code => highlight(code, languages.jsx)}
        padding={10}
        style={editorStyle}
      />
    </Modal>
  )
}
