import isEmpty from 'lodash/isEmpty.js'
import keyBy from 'lodash/keyBy.js'
import { state } from './state'
import { renderInitialPage, watchForStateChanges } from '../modules/views'
import { validateFields } from '../modules/validation'
import { updateFeeds, autoUpdate } from '../modules/feeds'

export default () => {
  renderInitialPage()

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

  Object.entries(elements.fields).forEach(([fieldName, fieldElement]) => {
    fieldElement.addEventListener('input', (e) => {
      const { value } = e.target

      state.form.fields[fieldName] = value
      state.form.fieldsUi.touched[fieldName] = true

      validateFields()
        .then(() => state.form.validationErrors = {})
        .catch((yupValidationError) => {
          const errors = keyBy(yupValidationError.inner, 'path')
          state.form.validationErrors = errors
        })
        .finally(() => {
          state.form.valid = isEmpty(state.form.validationErrors)
        })
    })
  })

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault()
    if (!state.form.valid) return
  
    const data = { url: state.form.fields.url }
    state.feedURLs = [...state.feedURLs, data.url]
    elements.form.reset()
  
    updateFeeds()
  })

  const postPreviewModal = document.getElementById('post-preview-modal')
  document.querySelectorAll('.modal-close').forEach((button) => {
    button.addEventListener('click', () => postPreviewModal.close())
  })
  document.querySelector('.contents').addEventListener('click', (e) => {
    if (!e.target.classList.contains('modal-show')) return

    const { title, description } = e.target.dataset
    document.getElementById('modal-title').textContent = title
    document.getElementById('modal-body-text').textContent = description
    document.getElementById('modal-link').href = '#'

    postPreviewModal.showModal()
  })

  document.addEventListener('DOMContentLoaded', () => {
    autoUpdate()
  })

  watchForStateChanges(elements)
}