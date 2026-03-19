import keyBy from 'lodash/keyBy.js'
import * as yup from 'yup'

const schema = yup.object().shape({
  url: yup.string().required().url().nullable(),
})

const validate = (fields) => {
  try {
    schema.validateSync(fields, { abortEarly: false })
    return {}
  } catch (e) {
    return keyBy(e.inner, 'path')
  }
}

export { validate }