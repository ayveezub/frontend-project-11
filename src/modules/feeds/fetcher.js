import { i18nextInstance as i18 } from '../../app/i18'

const HEXLET_PROXY = 'https://allorigins.hexlet.app/get?disable_cache=true&url='

const proxyfy = (url) => `${HEXLET_PROXY}${encodeURIComponent(url)}`

const fetchAllFeeds = (feeds) => {
  const promises = feeds.map(feed => {
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
      .then(response => response.json())
  })

  return Promise.allSettled(promises)
}

const handleNetworkErrors = (result) => {
  if (
    result.status === 'fulfilled'
    && result.value.status.http_code >= 200
    && result.value.status.http_code <= 299
  ) return result

  return ({
    status: 'rejected',
    reason: new Error(i18.t('errors.network')),
  })
}

export { fetchAllFeeds, handleNetworkErrors }