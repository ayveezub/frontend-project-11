import * as yup from 'yup'
import { i18nextInstance as i18 } from '../../app/i18'
import { state, snapshot } from '../../app/state'

const validateFields = () => {
  const snap = snapshot(state)
  const { feedURLs } = snap
  const { fields } = snap.form

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