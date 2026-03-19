import renderInitialPage from './initialPage'
import { renderValidationErrors } from './feedback'
import renderFeedsMeta from './feedsMeta'
import renderPosts from './posts'

const watch = (elements, state, i18nextInstance) => (path, value, prevValue) => {
  switch (path) {
    case 'updatingProcess.processState':
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