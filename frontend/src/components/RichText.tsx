import React from 'react'
import { Editor } from '@tinymce/tinymce-react'
import { EventHandler } from '@tinymce/tinymce-react/lib/cjs/main/ts/Events'
import { initValues } from './RichTextFormik'
import { TINYMCE_SCRIPT_PATH } from 'constants/tinymce'

export interface RichTextProps {
  value?: string
  inline?: boolean
  init?: Record<string, any> 
  onBlur?: EventHandler<FocusEvent>
  onFocus?: EventHandler<FocusEvent>
  onChange: (value: string) => void
}

export const RichText: React.FC<RichTextProps> = ({
  value = '',
  onChange,
  onFocus,
  onBlur,
  init = initValues,
  inline = false,
}) => {
  return (
  <Editor
    initialValue={value}
    onEditorChange={onChange}
    onBlur={onBlur}
    onFocus={onFocus}
    tinymceScriptSrc={TINYMCE_SCRIPT_PATH}
    init={init}
    inline={inline}
  />
)}
