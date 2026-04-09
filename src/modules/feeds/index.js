import { fetchAllFeeds } from './fetcher'
import { parseRSS } from './parser'
import { state } from '../../app/state'

const extractFreshPosts = (feedMeta, feedItems) => {
  const feed = state.getFeedByUrl(feedMeta.feedUrl)
  const { lastModified } = feed

  return feedItems
    .filter(({ pubDate }) => pubDate.getTime() > lastModified.getTime())
}

const newProcessStatus = (state, error = null) => ({
  state,
  error,
})

const updateFeed = (feedMeta) => {
  const { feedUrl, title, link, description } = feedMeta
  const feed = state.getFeedByUrl(feedUrl)

  feed.title = title
  feed.link = link
  feed.description = description
  feed.lastModified = new Date()
}

const updateFeedsAndPosts = () => {
  const { feeds } = state
  if (feeds.length === 0) return
  if (state.updatingProcess.state === 'updating') return
  state.updatingProcess = newProcessStatus('updating')

  fetchAllFeeds(feeds)
  .then(jsonResponses => jsonResponses
    .filter(Boolean)
    .map(parseRSS)
  )
  .then(contents => contents
    .filter(Boolean)
    .map(({ feedMeta, feedItems }) => {
      const freshPosts = extractFreshPosts(feedMeta, feedItems)

      updateFeed(feedMeta)
      return freshPosts
    })
  )
  .then(allFreshPosts => {
    const newPosts = allFreshPosts.flat()
    if (newPosts.length === 0) {
      state.updatingProcess = newProcessStatus('idle')
      return
    }

    state.posts = [...newPosts, ...state.posts]
    state.updatingProcess = newProcessStatus('success')
  })
  .catch(error => {  
    state.updatingProcess = newProcessStatus('error', error)
  })
}

const autoUpdate = () => {
  try {
    updateFeedsAndPosts()
  } finally {
    setTimeout(() => autoUpdate(), 5000)
  }
}

export { updateFeedsAndPosts, autoUpdate }