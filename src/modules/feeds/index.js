import { fetchAllFeeds } from './fetcher'
import { parseRSS } from './parser'
import { state } from '../../app/state'

const extractFreshPosts = (feedMeta, feedItems) => {
  const feed = state.getFeedByUrl(feedMeta.feedUrl)
  const { lastModified } = feed

  return feedItems
    .filter(({ pubDate }) => pubDate.getTime() > lastModified.getTime())
}

const newProcessStatus = (state, errors = null) => ({
  state,
  errors,
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
    .then(results => results.map((result, index) => {
      if (result.status === 'rejected') return result

      const { feedUrl } = feeds.at(index)
      return parseRSS(result.value, feedUrl)
    }))
    .then((parsedResults) => {
      const errors = parsedResults
        .filter(({ status }) => status === 'rejected')
        .map(({ reason }) => reason)

      const allFreshPosts = parsedResults
        .filter(({ status }) => status === 'fulfilled')
        .flatMap((parsedResult) => {
          const { feedMeta, feedItems } = parsedResult.value
          const freshPosts = extractFreshPosts(feedMeta, feedItems)

          updateFeed(feedMeta)
          return freshPosts
        })

      if (allFreshPosts.length === 0 && errors.length === 0) {
        state.updatingProcess = newProcessStatus('idle')
        return
      }
      state.posts = [...allFreshPosts, ...state.posts]
      errors.length === 0
        ? state.updatingProcess = newProcessStatus('success')
        : state.updatingProcess = newProcessStatus('error', errors)
    })
}

const autoUpdate = () => {
  try {
    updateFeedsAndPosts()
  }
  finally {
    setTimeout(() => autoUpdate(), 5000)
  }
}

export { updateFeedsAndPosts, autoUpdate }
