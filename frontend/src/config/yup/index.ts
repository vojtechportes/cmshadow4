import { setIn, FormikErrors } from 'formik'
import * as Yup from 'yup'

Yup.setLocale({
  mixed: {
    default: 'mixed.default',
    required: 'mixed.required',
  },
  string: {
    length: 'string.length',
    min: 'string.min',
    max: 'string.max',
    email: 'string.email',
  },
  number: {
    min: 'number.min',
    max: 'number.max',
    lessThan: 'number.lessThan',
    moreThan: 'number.moreThan',
    integer: 'number.integer',
  },
  date: {
    min: 'date.min',
    max: 'date.max',
  },
})

export const emptyErrors: FormikErrors<unknown> = {}

export const validateSchema = async <FormValues>(
  values: FormValues,
  validationSchema: Yup.ObjectSchema<Partial<FormValues>>,
  options: Yup.ValidateOptions = { abortEarly: false }
) =>
  validationSchema
    .validate(values, options)
    .then(() => Promise.resolve(emptyErrors))
    .catch((errors: Yup.ValidationError) => {
      if (errors.name === 'ValidationError') {
        let filteredErrors: any = {}

        if (errors.inner.length > 0) {
          errors.inner.forEach(error => {
            filteredErrors = setIn(filteredErrors, error.path, {
              message: error.message,
              params: error.params,
            })
          })
        }

        return Promise.resolve(filteredErrors)
      } else {
        return Promise.reject(errors)
      }
    })
