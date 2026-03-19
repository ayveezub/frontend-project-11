import onChange from 'on-change'
import isEmpty from 'lodash/isEmpty.js'
import keyBy from 'lodash/keyBy.js'
import { renderInitialPage, watch } from '../modules/views'
import { validateFields } from '../modules/validation'
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

      validateFields(state)
        .then(() => watchedState.form.validationErrors = {})
        .catch((yupValidationError) => {
          const errors = keyBy(yupValidationError.inner, 'path')
          watchedState.form.validationErrors = errors
        })
        .finally(() => watchedState.form.valid = isEmpty(state.form.validationErrors))
    })
  })

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault()
    if (!state.form.valid) return
  
    const data = { url: state.form.fields.url }
    watchedState.feedURLs = [...state.feedURLs, data.url]
    elements.form.reset()
  
    updateFeeds(watchedState)
  })

  document.addEventListener('DOMContentLoaded', () => {
    autoUpdate(watchedState)
  })
}