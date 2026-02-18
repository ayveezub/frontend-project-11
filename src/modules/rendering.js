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

const makeTitleCardElement = (cardTitle) => {
  const div = document.createElement('div')
  div.className = 'card-body'

  const titleElement = document.createElement('h2')
  titleElement.className = 'card-title h4'
  titleElement.textContent = cardTitle

  div.append(titleElement)
  return div
}

const makeFeedsMetaLiElement = (feedMeta) => {
  const { feedURL, title, description } = feedMeta

  const li = document.createElement('li')
  li.className = 'list-group-item border-0 border-end-0'
  li.dataset.feedUrl = feedURL

  const h3 = document.createElement('h3')
  h3.className = 'h6 m-0'
  h3.textContent = title

  const p = document.createElement('p')
  p.className = 'm-0 small text-black-50'
  p.textContent = description

  li.append(h3, p)
  return li
}

const makeFeedsMetaUlElement = (rssContents) => {
  const ul = document.createElement('ul')
  ul.className = 'list-group border-0 rounded-0'

  const listItems = rssContents
    .map(({ feedMeta }) => makeFeedsMetaLiElement(feedMeta))

  ul.append(...listItems)
  return ul
}

const renderFeedsMeta = (elements, rssContents) => {
  const { feedsContainer } = elements

  const titleCard = makeTitleCardElement('Фиды')
  const ul = makeFeedsMetaUlElement(rssContents)

  feedsContainer.replaceChildren(titleCard, ul)
}

const makePostsLiElement = (feedItem) => {
  const { feedURL, title, pubDate } = feedItem

  const li = document.createElement('li')
  li.className
    = 'list-group-item d-flex justify-content-between align-items-start border-0 border-end-0'
  
  const a = document.createElement('a')
  a.className = 'fw-bold'
  a.dataset.feedUrl = feedURL
  a.href = '#'
  a.textContent = `${title} ${pubDate}`

  li.append(a)
  return li
}

const makePostsUlElement = (rssContents) => {
  const ul = document.createElement('ul')
  ul.className = 'list-group border-0 rounded-0'

  const listItems = rssContents
    .flatMap(({ feedItems }) => feedItems)
    .map(makePostsLiElement)

  ul.append(...listItems)
  return ul
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