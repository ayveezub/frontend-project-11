import { i18nextInstance as i18 } from '../../app/i18'

const CORS_PROXY = 'https://allorigins.hexlet.app'

const proxyfy
  = (url) => `${CORS_PROXY}/get?disableCache=true&url=${encodeURIComponent(url)}`

const fetchAllFeeds = (feeds) => {
  const fetchPromises = feeds.map(feed => {
    const { feedUrl } = feed
    const fetchOptions = {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      mode: 'cors',
      credentials: 'omit',
      cache: 'no-cache',
      redirect: 'follow',
      signal: AbortSignal.timeout(1500)
    }
  
    return fetch(proxyfy(feedUrl), fetchOptions)
      .then(proxyResponse => {
        if (!proxyResponse.ok) throw new Error
        return proxyResponse.json()
      })
      .then(data => {
        const actualStatus = data.status?.http_code
        if (
          actualStatus < 200
          || actualStatus > 299
        ) throw new Error

        return data.contents
      })
      .catch(() => {
        throw new Error(i18.t('errors.network'))
      })
  })

  return Promise.allSettled(fetchPromises)
}

export { fetchAllFeeds }