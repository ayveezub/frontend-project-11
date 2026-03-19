import has from 'lodash/has.js'

const renderFeedback = (elements, fieldElement, error) => {
  fieldElement.classList.add('is-invalid')
  elements.feedback.textContent = error.message
}

const renderValidationErrors = (elements, errors, prevErrors, state) => {
  Object.entries(elements.fields).forEach(([fieldName, fieldElement]) => {
    const error = errors[fieldName]

    const fieldHadError = has(prevErrors, fieldName)
    const fieldHasError = has(errors, fieldName)

    if (!fieldHadError && !fieldHasError) return

    if (fieldHadError && !fieldHasError) {
      fieldElement.classList.remove('is-invalid')
      elements.feedback.textContent = ''
      return
    }

    if (state.form.fieldsUi.touched[fieldName] && fieldHasError) {
      renderFeedback(elements, fieldElement, error)
    }
  })
}

export { renderValidationErrors }