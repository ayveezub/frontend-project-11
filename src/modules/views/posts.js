import { i18nextInstance as i18 } from '../../app/i18'
import { state, snapshot } from '../../app/state'
import { makeTitleCardElement } from './rendererUtils'

const makePostsLiElement = (post) => {
  const { id, title, link, pubDate, touched } = post

  const li = document.createElement('li')
  li.className
    = 'list-group-item d-flex justify-content-between align-items-start border-0 border-end-0'
  
  const a = document.createElement('a')
  a.className = touched ? 'link-secondary' : 'fw-bold'
  a.href = link
  a.textContent = `${title} ${pubDate.toUTCString()}`

  const button = document.createElement('button')
  button.className = 'btn btn-outline-primary btn-sm modal-show'
  button.type = 'button'
  button.textContent = i18.t('contents.posts.preview')
  button.dataset.id = id

  li.append(a, button)
  return li
}

const makePostsUlElement = () => {
  const snap = snapshot(state)
  const ul = document.createElement('ul')
  ul.className = 'list-group border-0 rounded-0'

  const listItems = snap
    .posts
    .map(makePostsLiElement)

  ul.append(...listItems)
  return ul
}

const renderPosts = (elements) => {
  const { postsContainer } = elements

  const titleCard = makeTitleCardElement(i18.t('contents.posts.title'))
  const ul = makePostsUlElement()

  postsContainer.replaceChildren(titleCard, ul)
}

const renderPostPreviewModal = (elements, post) => {
  elements.modalElements.title.classList.remove('fw-bold')
  elements.modalElements.title.classList.remove('fw-normal')

  const { title, link, description, touched } = post

  elements.modalElements.title.textContent = title
  touched
    ? elements.modalElements.title.classList.add('fw-normal')
    : elements.modalElements.title.classList.add('fw-bold')

  elements.modalElements.text.textContent = description
  elements.modalElements.link.dataset.link = link
}

export { renderPosts, renderPostPreviewModal }