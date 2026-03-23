import { proxy, snapshot, subscribe } from 'valtio/vanilla'

const state = proxy({
  updatingProcess: {
    processState: 'filling',
    processError: null,
  },
  feedURLs: [],
  rssContents: [],
  form: {
    valid: true,
    validationErrors: {},
    fields: { url: '' },
    fieldsUi: { touched: { url: false } }
  },
})

export {
  state,
  snapshot,
  subscribe,
}