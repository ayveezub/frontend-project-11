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
        throw new Error(`Failed to fetch ${feedUrl}: ${response.status}`)
      })  
  })

  return Promise.all(fetchPromises)
}

export { fetchAllFeeds }