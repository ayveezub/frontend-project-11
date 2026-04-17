import uniqueId from 'lodash/uniqueId.js'
import { i18nextInstance as i18 } from '../../app/i18'

const extractFeedMeta = (xmlDoc, feedUrl) => {
  const channel = xmlDoc.querySelector('channel')
  if (!channel) throw new Error

  const title = channel.querySelector('title')?.textContent || 'Untitled feed'
  const link = channel.querySelector('link')?.textContent || '#'
  const description = channel.querySelector('description')?.textContent || 'No description'

  return ({ feedUrl, title, link, description })
}

const extractFeedItems = (xmlDoc, feedUrl) => {
  const items = xmlDoc.querySelectorAll('item')
  
  return Array.from(items).map(item => ({
    id: uniqueId('post-'),
    feedUrl,
    title: item.querySelector('title')?.textContent || 'Untitled post',
    link: item.querySelector('link')?.textContent || '#',
    description: item.querySelector('description')?.textContent || 'No description',
    pubDate: new Date(item.querySelector('pubDate')?.textContent || ''),
    touched: false,
  }))
}

const parseRSS = (xmlString, feedUrl) => {
  try {
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(xmlString, 'application/xml')
    if (xmlDoc.querySelector('parsererror')) throw new Error

    const feedMeta = extractFeedMeta(xmlDoc, feedUrl)
    const feedItems = extractFeedItems(xmlDoc, feedUrl)

    return ({
      status: 'fulfilled',
      value: { feedMeta, feedItems },
    })
  } catch {
    return ({
      status: 'rejected',
      reason: new Error(i18.t('errors.parse')),
    })
  }
}

export { parseRSS }