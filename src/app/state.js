import { proxy, snapshot, subscribe, ref } from 'valtio/vanilla'

const state = proxy({
  updatingProcess: {
    state: 'idle',
    error: null,
  },
  feeds: [],
  posts: [],
  form: {
    valid: true,
    validationErrors: {},
    fields: { url: '' },
    fieldsUi: { touched: { url: false } }
  },
  getFeedByUrl: ref((url) => {
    return state.feeds.find(({ feedUrl }) => feedUrl === url)
  }),
  hasFeed: ref((url) => {
    return state.feeds.some(({ feedUrl }) => feedUrl === url)
  }),
  getPostById: ref((id) => {
    return state.posts.find(post => post.id === id)
  }),
})

export {
  state,
  snapshot,
  subscribe,
}