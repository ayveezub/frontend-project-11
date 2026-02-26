import has from 'lodash/has.js'
import {
  makeTitleCardElement,
  makePostsUlElement,
  makeFeedsMetaUlElement,
} from './uiElements'

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

const renderFeedsMeta = (elements, rssContents, state) => {
  const { feedsContainer } = elements
  const title = state.i18nextInstance.t('content.feeds.title')

  const titleCard = makeTitleCardElement(title)
  const ul = makeFeedsMetaUlElement(rssContents)

  feedsContainer.replaceChildren(titleCard, ul)
}

const renderPosts = (elements, rssContents, state) => {
  const { postsContainer } = elements
  const title = state.i18nextInstance.t('content.posts.title')

  const titleCard = makeTitleCardElement(title)
  const ul = makePostsUlElement(rssContents)

  postsContainer.replaceChildren(titleCard, ul)
}

export {
  renderFeedback,
  renderValidationErrors,
  renderFeedsMeta,
  renderPosts,
}