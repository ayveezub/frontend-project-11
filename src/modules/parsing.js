const extractFeedMeta = (xmlDoc, feedURL) => {
  const channel = xmlDoc.querySelector('channel')
  const title = channel.querySelector('title').textContent || 'Untitled feed'
  const description = channel.querySelector('description').textContent || 'No description'

  return { feedURL, title, description }
}

const extractFeedItems = (xmlDoc, feedURL) => {
  const items = xmlDoc.querySelectorAll('item')
  
  return Array.from(items).map(item => ({
    feedURL,
    title: item.querySelector('title').textContent || 'Untitled post',
    description: item.querySelector('description').textContent || 'No description',
    pubDate: item.querySelector('pubDate').textContent || 'Unknown date',
  }))
}

const parseRSS = (jsonResponse) => {
  const parser = new DOMParser()
  const xmlString = jsonResponse.contents
  const xmlDoc = parser.parseFromString(xmlString, 'application/xml')
  const feedURL = jsonResponse.status.url

  const feedMeta = extractFeedMeta(xmlDoc, feedURL)
  const feedItems = extractFeedItems(xmlDoc, feedURL)

  return { feedMeta, feedItems }
}

export { parseRSS }