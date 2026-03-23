import { i18nextInstance as i18 } from '../../app/i18'
import { makeTitleCardElement } from './rendererUtils'

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

export default (elements, rssContents) => {
  const { feedsMetaContainer } = elements

  const titleCard = makeTitleCardElement(i18.t('contents.feedsMeta.title'))
  const ul = makeFeedsMetaUlElement(rssContents)

  feedsMetaContainer.replaceChildren(titleCard, ul)
}