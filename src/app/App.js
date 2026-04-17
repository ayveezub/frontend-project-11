import isEmpty from 'lodash/isEmpty.js'
import keyBy from 'lodash/keyBy.js'
import { state } from './state'
import { renderInitialPage, watchForStateChanges } from '../modules/views'
import { validateFields } from '../modules/validation'
import { autoUpdate, updateFeedsAndPosts } from '../modules/feeds'
import '../assets/styles/main.css'

export default () => {
  renderInitialPage()

  const elements = {
    form: document.querySelector('.rss-form'),
    fields: {
      url: document.getElementById('url-input'),
    },
    submitButton: document.getElementById('submit-button'),
    feedback: document.querySelector('.feedback'),
    postsContainer: document.querySelector('.posts'),
    feedsContainer: document.querySelector('.feeds'),
  }

  Object.entries(elements.fields).forEach(([fieldName, fieldElement]) => {
    fieldElement.addEventListener('input', (e) => {
      e.target.value = e.target.value.trim()
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
    if (state.updatingProcess.state === 'updating') return
    if (!state.form.valid) return
  
    const data = { url: state.form.fields.url }
    const newFeed = {
      feedUrl: data.url,
      title: '',
      link: '#',
      description: '',
      lastModified: new Date(0),
    }
    state.feeds = [newFeed, ...state.feeds]
    elements.form.reset()

    updateFeedsAndPosts()
  })

  const postPreviewModal = document.getElementById('modal')
  document.getElementById('modal-link').addEventListener('click', (e) => {
    const { link } = e.target.dataset
    window.open(link)
    postPreviewModal.close()
  })
  document.querySelectorAll('.modal-close').forEach((button) => {
    button.addEventListener('click', () => postPreviewModal.close())
  })
  elements.postsContainer.addEventListener('click', (e) => {
    if (!e.target.classList.contains('modal-show')) return

    const { id } = e.target.dataset
    const post = state.getPostById(id)
    const { title, description, link } = post

    document.getElementById('modal-title').textContent = title
    document.getElementById('modal-body-text').textContent = description
    document.getElementById('modal-link').dataset.link = link

    post.touched = true
    postPreviewModal.showModal()
  })

  document.addEventListener('DOMContentLoaded', () => {
    autoUpdate()
  })

  watchForStateChanges(elements)
}