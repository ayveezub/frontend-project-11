import * as yup from 'yup'
import { i18nextInstance } from '../../app/i18'

const i18 = i18nextInstance

const validateFields = (state) => {
  const { feedURLs } = state
  const { fields } = state.form

  const schema = yup.object().shape({
    url: yup.string().required().url().test({
      name: 'is-unique-url',
      skipAbsent: true,
      message: () => i18.t('validation.custom.uniqueURL'),
      test: (value) => !feedURLs.includes(value),
    }),
  })

  return schema
    .validate(fields, { abortEarly: false })
}

export { validateFields }