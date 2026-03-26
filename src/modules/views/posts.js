import { i18nextInstance as i18 } from '../../app/i18'
import { makeTitleCardElement } from './rendererUtils'

const makePostsLiElement = (feedItem) => {
  const { feedURL : feedUrl, title, description, pubDate } = feedItem

  const li = document.createElement('li')
  li.className
    = 'list-group-item d-flex justify-content-between align-items-start border-0 border-end-0'
  
  const a = document.createElement('a')
  a.className = 'fw-bold'
  a.href = '#'
  a.textContent = `${title} ${pubDate}`

  const button = document.createElement('button')
  button.className = 'btn btn-outline-primary btn-sm modal-show'
  button.type = 'button'
  button.textContent = i18.t('contents.posts.preview')
  Object.assign(button.dataset, {
    feedUrl,
    title,
    description,
    pubDate,
  })

  li.append(a, button)
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

export default (elements, rssContents) => {
  const { postsContainer } = elements

  const titleCard = makeTitleCardElement(i18.t('contents.posts.title'))
  const ul = makePostsUlElement(rssContents)

  postsContainer.replaceChildren(titleCard, ul)
}