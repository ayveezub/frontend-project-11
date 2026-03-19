import onChange from 'on-change'
import isEmpty from 'lodash/isEmpty.js'
import { renderInitialPage, watch } from '../modules/views'
import { validate } from '../modules/validation'
import { updateFeeds, autoUpdate } from '../modules/feeds'

export default (state, i18nextInstance) => {
  renderInitialPage(i18nextInstance)

  const elements = {
    form: document.querySelector('.rss-form'),
    fields: {
      url: document.getElementById('url-input'),
    },
    submitButton: document.querySelector('input[type="submit"]'),
    feedback: document.querySelector('.feedback'),
    postsContainer: document.querySelector('.posts'),
    feedsMetaContainer: document.querySelector('.feeds-meta'),
  }

  const watchedState = onChange(
    state,
    watch(elements, state, i18nextInstance)
  )

  Object.entries(elements.fields).forEach(([fieldName, fieldElement]) => {
    fieldElement.addEventListener('input', (e) => {
      const { value } = e.target
      watchedState.form.fields[fieldName] = value
      watchedState.form.fieldsUi.touched[fieldName] = true

      const errors = validate(state.form.fields)
      watchedState.form.validationErrors = errors
      watchedState.form.valid = isEmpty(errors)
    })
  })

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault()
  
    const data = { url: state.form.fields.url }
    if (state.feedURLs.includes(data.url)) {
      watchedState.form.validationErrors = { url: { message: 'RSS уже добавлен' } }
      return
    }
    watchedState.feedURLs = [...state.feedURLs, data.url]
  
    updateFeeds(watchedState)
  })

  document.addEventListener('DOMContentLoaded', () => {
    autoUpdate(watchedState)
  })
}