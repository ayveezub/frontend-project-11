import { i18nextInstance as i18 } from '../../app/i18'
import { state, snapshot } from '../../app/state'
import { makeTitleCardElement } from './rendererUtils'

const makeFeedsLiElement = (feed) => {
  const { feedUrl, title, description } = feed

  const li = document.createElement('li')
  li.className = 'list-group-item border-0 border-end-0'
  li.dataset.feedUrl = feedUrl

  const h3 = document.createElement('h3')
  h3.className = 'h6 m-0'
  h3.textContent = title

  const p = document.createElement('p')
  p.className = 'm-0 small text-black-50'
  p.textContent = description

  li.append(h3, p)
  return li
}

const makeFeedsUlElement = () => {
  const snap = snapshot(state)
  const ul = document.createElement('ul')
  ul.className = 'list-group border-0 rounded-0'

  const listItems = snap
    .feeds
    .map(makeFeedsLiElement)

  ul.append(...listItems)
  return ul
}

export default (elements) => {
  const { feedsContainer } = elements

  const titleCard = makeTitleCardElement(i18.t('contents.feeds.title'))
  const ul = makeFeedsUlElement()

  feedsContainer.replaceChildren(titleCard, ul)
}
