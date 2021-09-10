import React, { useCallback } from 'react'
import Editor from 'react-simple-code-editor'
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import { useFormikContext, useField } from 'formik';
import styled from 'styled-components'
import { COLORS } from 'constants/colors'

const Container = styled.div`
  border: 1px solid ${COLORS.gray1};
`

export interface CodeEditorFormikProps {
  name: string
}

export const editorStyle: React.CSSProperties = {
  fontFamily: '"Fira code", "Fira Mono", monospace',
  fontSize: 12,
}

export const CodeEditorFormik
: React.FC<CodeEditorFormikProps> = ({
  name
}) => {
  const { setFieldValue, setFieldTouched } = useFormikContext()
  const [field] = useField(name)

  const handleEditorChange = useCallback(
    (content: string) => {
      setFieldValue(name, content)
      setFieldTouched(name, true)
    },
    [setFieldValue, setFieldTouched, name]
  )

  return (
    <Container>
      <Editor
        value={field.value}
        onValueChange={handleEditorChange}
        highlight={code => highlight(code, languages.markup)}
        padding={10}
        style={editorStyle}
      />
    </Container>
  )
}