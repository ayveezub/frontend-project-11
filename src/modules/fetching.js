import { HEXLET_PROXY } from './constants'
import { parseRSS } from './parsing'

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

const updateFeeds = (state) => {
  if (state.feedURLs.length === 0) return
  if (state.updatingProcess.processState === 'updating') return

  state.updatingProcess.processError = null
  state.updatingProcess.processState = 'updating'

  fetchAllFeeds(state.feedURLs)
  .then(jsonResponses => jsonResponses.map(parseRSS))
  .then(rssContents => {
    state.rssContents = rssContents
    state.updatingProcess.processState = 'filling'
  })
  .catch(error => {  
    state.updatingProcess.processError = error
    state.updatingProcess.processState = 'error'
  })
}

const autoUpdate = (state) => {
  try {
    updateFeeds(state)
  } catch (error) {
    console.error('autoUpdate error:', error)
  } finally {
    setTimeout(() => autoUpdate(state), 5000)
  }
}

export { updateFeeds, autoUpdate }