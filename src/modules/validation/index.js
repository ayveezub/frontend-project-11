import * as yup from 'yup'

const validateFields = (state) => {
  const { feedURLs } = state
  const { fields } = state.form

  const schema = yup.object().shape({
    url: yup.string().required().url().test({
      name: 'is-unique',
      skipAbsent: true,
      message: `RSS уже добавлен`,
      test: (value) => !feedURLs.includes(value),
    }),
  })

  return schema
    .validate(fields, { abortEarly: false })
}

export { validateFields }