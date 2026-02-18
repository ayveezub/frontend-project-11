import { INITIAL_HOME_PAGE_HTML } from './modules/constants'
import { validate } from './modules/validation'
import isEmpty from 'lodash/isEmpty.js'
import {
  renderValidationErrors,
  renderPosts,
  renderFeedsMeta,
} from './modules/rendering'
import { updateFeeds, autoUpdate } from './modules/fetching'
import onChange from 'on-change'

const handleProcessState = (elements, processState) => {
  switch (processState) {
    case 'error':
      break

    case 'updating':
      break

    case 'filling':
      elements.form.reset()
      break

    default:
      throw new Error(`Unknown updating process state: ${processState}`)
  }
}

const watch = (elements, originalState) => (path, value, prevValue) => {
  switch (path) {
    case 'updatingProcess.processState':
      handleProcessState(elements, value)
      break

    case 'form.validationErrors':
      renderValidationErrors(elements, value, prevValue, originalState)
      break

    case 'rssContents':
      renderFeedsMeta(elements, value)
      renderPosts(elements, value)
      break

    default:
      break
  }
}

export default () => {
  document.querySelector('#app').innerHTML = INITIAL_HOME_PAGE_HTML
  const elements = {
    form: document.querySelector('.rss-form'),
    fields: {
      url: document.getElementById('url-input'),
    },
    submitButton: document.querySelector('input[type="submit"]'),
    feedback: document.querySelector('.feedback'),
    postsContainer: document.querySelector('.posts'),
    feedsContainer: document.querySelector('.feeds'),
  }

  const originalState = {
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
    }
  }
  const state = onChange(originalState, watch(elements, originalState))

  Object.entries(elements.fields).forEach(([fieldName, fieldElement]) => {
    fieldElement.addEventListener('input', (e) => {
      const { value } = e.target
      state.form.fields[fieldName] = value
      state.form.fieldsUi.touched[fieldName] = true

      const errors = validate(state.form.fields)
      state.form.validationErrors = errors
      state.form.valid = isEmpty(errors)
    })
  })

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault()

    const data = { url: state.form.fields.url }
    if (state.feedURLs.includes(data.url)) {
      state.form.validationErrors = { url: { message: 'RSS уже добавлен' } }
      return
    }
    state.feedURLs = [...state.feedURLs, data.url]

    updateFeeds(state)
  })

  document.addEventListener('DOMContentLoaded', () => autoUpdate(state))
}