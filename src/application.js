import keyBy from 'lodash/keyBy.js'
import has from 'lodash/has.js'
import isEmpty from 'lodash/isEmpty.js'
import onChange from 'on-change'
import * as yup from 'yup'

const rssFormPage = `
 <main class="flex-grow-1">
   <section class="container-fluid bg-dark p-5">
     <div class="row">
       <div class="col-md-10 col-lg-8 mx-auto text-white">
         <h1 class="display-3 mb-0">RSS Aggregator</h1>
         <p class="lead">
           Начните читать RSS сегодня! Это легко, это красиво.
         </p>
         <form class="rss-form text-body" action="">
           <div class="row">
             <div class="col">
               <div class="form-floating">
                  <input
                    id="url-input"
                    autofocus=""
                    type="text"
                    required=""
                    name="url"
                    aria-label="url"
                    class="form-control w-100"
                    placeholder="ссылка RSS"
                    autocomplete="off"
                  >
                  <label for="url-input">Ссылка RSS</label>
               </div>
             </div>
             <div class="col-auto">
                <button
                  type="submit"
                  aria-label="add"
                  class="h-100 btn btn-lg btn-primary px-sm-5"
                >
                  Добавить
                </button>
             </div>
           </div>
         </form>
         <p class="mt-2 mb-0 text-secondary">
           Пример: https://lorem-rss.hexlet.app/feed
         </p>
         <p class="feedback m-0 position-absolute small text-danger"></p>
       </div>
     </div>
   </section>
   <section class="container-fluid container-xxl p-5"></section>
 </main>
`

const schema = yup.object().shape({
  url: yup.string().required().url().nullable(),
})

const validate = (fields) => {
  try {
    schema.validateSync(fields, { abortEarly: false })
    return {}
  } catch (e) {
    return keyBy(e.inner, 'path')
  }
}

const handleProcessState = (elements, processState) => {
  switch (processState) {
    case 'sent':
      break

    case 'error':
      break

    case 'sending':
      break

    case 'filling':
      elements.form.reset()
      break

    default:
      throw new Error(`Unknown process state: ${processState}`)
  }
}

const renderFieldError = (elements, fieldElement, error) => {
  fieldElement.classList.add('is-invalid')
  elements.feedback.textContent = error.message
}

const renderErrors = (elements, errors, prevErrors, state) => {
  Object.entries(elements.fields).forEach(([fieldName, fieldElement]) => {
    const error = errors[fieldName]

    const fieldHadError = has(prevErrors, fieldName)
    const fieldHasError = has(errors, fieldName)

    if (!fieldHadError && !fieldHasError) return

    if (fieldHadError && !fieldHasError) {
      fieldElement.classList.remove('is-invalid')
      elements.feedback.textContent = ''
      return
    }

    if (state.form.fieldsUi.touched[fieldName] && fieldHasError) {
      renderFieldError(elements, fieldElement, error)
    }
  })
}

const render = (elements, initialState) => (path, value, prevValue) => {
  switch (path) {
    case 'addingFeedProcess.processState':
      handleProcessState(elements, value)
      break

    case 'form.valid':
      break

    case 'form.errors':
      renderErrors(elements, value, prevValue, initialState)
      break

    default:
      break
  }
}

export default () => {
  document.querySelector('#app').innerHTML = rssFormPage
  const elements = {
    form: document.querySelector('.rss-form'),
    fields: {
      url: document.getElementById('url-input'),
    },
    submitButton: document.querySelector('input[type="submit"]'),
    feedback: document.querySelector('.feedback'),
  }

  const initialState = {
    addingFeedProcess: {
      processState: 'filling',
      processError: null,
    },
    feeds: { links: [] },
    form: {
      valid: true,
      errors: {},
      fields: { url: '' },
      fieldsUi: { touched: { url: false } }
    }
  }
  const state = onChange(initialState, render(elements, initialState))

  Object.entries(elements.fields).forEach(([fieldName, fieldElement]) => {
    fieldElement.addEventListener('input', (e) => {
      const { value } = e.target
      state.form.fields[fieldName] = value
      state.form.fieldsUi.touched[fieldName] = true

      const errors = validate(state.form.fields)
      state.form.errors = errors
      state.form.valid = isEmpty(errors)
    })
  })

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault()

    state.addingFeedProcess.processState = 'sending'
    state.addingFeedProcess.processError = null

    const data = { url: state.form.fields.url }
    if (state.feeds.links.includes(data.url)) {
      state.form.errors = { url: { message: 'RSS уже добавлен' } }
      return
    }

    state.feeds.links = [...state.feeds.links, data.url]

    state.addingFeedProcess.processState = 'filling'
  })
}