import React, { useCallback } from 'react'
import { Editor, IAllProps } from '@tinymce/tinymce-react'
import { useFormikContext, useField } from 'formik'
import { TINYMCE_SCRIPT_PATH } from 'constants/tinymce'
import { FileManagerApi } from 'api/FileManager'

const { CMS_BASE_URL } = window._envConfig

export const initValues: Record<string, any> = {
  height: 350,
  toolbar: `undo redo | formatselect | image 
   | bold italic backcolor | alignleft aligncenter 
   alignright alignjustify | bullist numlist outdent indent | removeformat `,
  plugins: [
    'image imagetools',
    'lists link',
    'searchreplace visualblocks code fullscreen',
    'insertdatetime media table paste code help wordcount',
  ],
  images_upload_url: CMS_BASE_URL + '/filemanager',
  image_upload_credentials: true,
  automatic_uploads: true,
  image_title: true,
  images_upload_handler: async (
    blobInfo: {
      blob: () => any
      filename: () => string
    },
    success: (value: string) => void,
    failure: (value: string) => void,
    _progress: (value: number) => void
  ) => {
    const formData = new FormData()
    formData.append('file', blobInfo.blob(), blobInfo.filename())

    try {
      const {
        data: { location },
      } = await FileManagerApi.upload(formData)

      success(location)
    } catch (e) {
      failure('File upload failed')
    }
  },
  entity_encoding: 'raw',
  paste_as_text: true,
}

export interface RichTextFormikProps extends IAllProps {
  name: string
}

export const RichTextFormik: React.FC<RichTextFormikProps> = ({
  name,
  ...props
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
    <Editor
      initialValue={field.value}
      onEditorChange={handleEditorChange}
      tinymceScriptSrc={TINYMCE_SCRIPT_PATH}
      init={initValues}
      {...props}
    />
  )
}
