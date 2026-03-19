import renderInitialPage from './initialPage'
import { renderValidationErrors } from './feedback'
import renderFeedsMeta from './feedsMeta'
import renderPosts from './posts'

const handleUpdatingProcess = (elements, processState) => {
  switch (processState) {
    case 'error':
      break

    case 'updating':
      break

    case 'filling':
      elements.form.reset()
      break

    default:
      throw new Error(`Unknown updating process state: ${processState}`)
  }
}

const watch = (elements, state, i18nextInstance) => (path, value, prevValue) => {
  switch (path) {
    case 'updatingProcess.processState':
      handleUpdatingProcess(elements, value)
      break

    case 'form.validationErrors':
      renderValidationErrors(elements, value, prevValue, state)
      break

    case 'rssContents':
      renderFeedsMeta(elements, value, i18nextInstance)
      renderPosts(elements, value, i18nextInstance)
      break

    default:
      break
  }
}

export { renderInitialPage, watch }