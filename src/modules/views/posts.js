import { makeTitleCardElement } from './rendererUtils'

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

export default (elements, rssContents, i18nextInstance) => {
  const { postsContainer } = elements
  const title = i18nextInstance.t('contents.posts.title')

  const titleCard = makeTitleCardElement(title)
  const ul = makePostsUlElement(rssContents)

  postsContainer.replaceChildren(titleCard, ul)
}