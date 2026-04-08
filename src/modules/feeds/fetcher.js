import { i18nextInstance as i18 } from '../../app/i18'

const HEXLET_PROXY = 'https://allorigins.hexlet.app/get?disable_cache=true&url='

const proxyfy = (url) => `${HEXLET_PROXY}${encodeURIComponent(url)}`

const fetchAllFeeds = (feeds) => {
  const fetchPromises = feeds.map(feed => {
    const { feedUrl } = feed
    const fetchOptions = {
      method: 'GET',
      headers: {
        'Accept': 'application/xml, text/xml, application/rss+xml, application/atom+xml, */*',
      },
      mode: 'cors',
      credentials: 'omit',
      cache: 'no-cache',
      redirect: 'follow',
    }
  
    return fetch(proxyfy(feedUrl), fetchOptions)  
      .then(response => {
        if (response.ok) {
          return response.json()
        }
        throw new Error(i18.t('feedback.feeds.errors.fetch'))
      })  
  })

  return Promise.all(fetchPromises)
}

export { fetchAllFeeds }