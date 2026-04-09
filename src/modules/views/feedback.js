import has from 'lodash/has.js'
import { i18nextInstance as i18 } from '../../app/i18'
import { state, snapshot } from '../../app/state'

const disableForm = (elements) => {
  elements.submitButton.disabled = true
  elements.fields.url.disabled = true
}

const enableForm = (elements) => {
  elements.submitButton.removeAttribute('disabled')
  elements.fields.url.removeAttribute('disabled')
  elements.fields.url.focus()
}

const renderFeedback = (elements, process) => {
  switch (process.state) {
    case 'idle':
      enableForm(elements)
      break

    case 'updating':
      disableForm(elements)
      break

    case 'error':
      elements.feedback.classList.remove('text-success')
      elements.feedback.classList.add('text-danger')
      elements.feedback.textContent = process.error.message

      enableForm(elements)
      break

    case 'success':
      elements.feedback.classList.remove('text-danger')
      elements.feedback.classList.add('text-success')
      elements.feedback.textContent = i18.t('feeds.update.success')

      enableForm(elements)
      break

    default:
      break
  }
}

const renderValidationErrors = (elements, errors, prevErrors) => {
  Object.entries(elements.fields).forEach(([fieldName, fieldElement]) => {
    const fieldHadError = has(prevErrors, fieldName)
    const fieldHasError = has(errors, fieldName)
    if (!fieldHadError && !fieldHasError) return
    if (fieldHadError && !fieldHasError) {
      fieldElement.classList.remove('is-invalid')
      elements.feedback.textContent = ''
      return
    }

    const snap = snapshot(state)
    if (snap.form.fieldsUi.touched[fieldName] && fieldHasError) {
      const error = errors[fieldName]
      fieldElement.classList.add('is-invalid')
      elements.feedback.classList.remove('text-success')
      elements.feedback.classList.add('text-danger')
      elements.feedback.textContent = error.message
    }
  })
}

export { renderFeedback, renderValidationErrors }