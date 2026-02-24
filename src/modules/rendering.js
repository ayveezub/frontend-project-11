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

const renderFeedsMeta = (elements, rssContents) => {
  const { feedsContainer } = elements

  const titleCard = makeTitleCardElement('Фиды')
  const ul = makeFeedsMetaUlElement(rssContents)

  feedsContainer.replaceChildren(titleCard, ul)
}

const renderPosts = (elements, rssContents) => {
  const { postsContainer } = elements

  const titleCard = makeTitleCardElement('Посты')
  const ul = makePostsUlElement(rssContents)

  postsContainer.replaceChildren(titleCard, ul)
}

export {
  renderFeedback,
  renderValidationErrors,
  renderFeedsMeta,
  renderPosts,
}