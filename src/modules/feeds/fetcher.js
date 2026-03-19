const HEXLET_PROXY = 'https://allorigins.hexlet.app/get?disable_cache=true&url='

const fetchAllFeeds = (feedURLs) => {
  const fetchPromises = feedURLs.map(feedURL =>  
    fetch(`${HEXLET_PROXY}${feedURL}`)  
      .then(response => {    
        if (!response.ok) {  
          throw new Error(`Failed to fetch ${feedURL}: ${response.status}`)  
        }
        return response.json()
      })  
  )

  return Promise.all(fetchPromises)
}

export { fetchAllFeeds }