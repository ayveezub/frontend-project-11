import keyBy from 'lodash/keyBy.js'
import has from 'lodash/has.js'
import isEmpty from 'lodash/isEmpty.js'
import onChange from 'on-change'
import * as yup from 'yup'

const rssAggregatorFormHTML = `
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
   <section class="container-fluid container-xxl p-5">
     <div class="row">
       <div class="col-md-10 col-lg-8 order-1 mx-auto posts"></div>
       <div class="col-md-10 col-lg-4 max-auto order-0 order-lg-1 feeds"></div>
     </div>
   </section>
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

const fetchAllFeeds = (feedURLs) => {
  const proxy = 'https://allorigins.hexlet.app/get?disable_cache=true&url='
  const fetchPromises = feedURLs.map(feedURL =>  
    fetch(`${proxy}${feedURL}`)  
      .then(response => {    
        if (!response.ok) {  
          throw new Error(`Failed to fetch ${feedURL}: ${response.status}`)  
        }
        return response.json()
      })  
  )

  return Promise.all(fetchPromises)
}

const extractFeedMeta = (xmlDoc, feedURL) => {
  const channel = xmlDoc.querySelector('channel')
  const title = channel.querySelector('title').textContent || 'Untitled feed'
  const description = channel.querySelector('description').textContent || 'No description'

  return { feedURL, title, description }
}

const extractFeedItems = (xmlDoc, feedURL) => {
  const items = xmlDoc.querySelectorAll('item')
  
  return Array.from(items).map(item => ({
    feedURL,
    title: item.querySelector('title').textContent || 'Untitled post',
    description: item.querySelector('description').textContent || 'No description',
    pubDate: item.querySelector('pubDate').textContent || 'Unknown date',
  }))
}

const parseRSS = (jsonResponse) => {
  const parser = new DOMParser()
  const xmlString = jsonResponse.contents
  const xmlDoc = parser.parseFromString(xmlString, 'application/xml')
  const feedURL = jsonResponse.status.url

  const feedMeta = extractFeedMeta(xmlDoc, feedURL)
  const feedItems = extractFeedItems(xmlDoc, feedURL)

  return { feedMeta, feedItems }
}

const updateFeeds = (state) => fetchAllFeeds(state.feedURLs)
  .then(jsonResponses => jsonResponses.map(parseRSS))
  .then(rssContents => {
    console.log(rssContents)
    state.rssContents = rssContents
    state.updatingProcess.processState = 'filling'
  })
  .catch(error => {  
    state.updatingProcess.processError = error
    state.updatingProcess.processState = 'error'
  })

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

const renderFeedback = (elements, fieldElement, error) => {
  fieldElement.classList.add('is-invalid')
  elements.feedback.textContent = error.message
}

const renderValidationErrors = (elements, errors, prevErrors, state) => {
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
      renderFeedback(elements, fieldElement, error)
    }
  })
}

const makeTitleCardElement = (cardTitle) => {
  const div = document.createElement('div')
  div.className = 'card-body'

  const titleElement = document.createElement('h2')
  titleElement.className = 'card-title h4'
  titleElement.textContent = cardTitle

  div.append(titleElement)
  return div
}

const makeFeedsMetaLiElement = (feedMeta) => {
  const { feedURL, title, description } = feedMeta

  const li = document.createElement('li')
  li.className = 'list-group-item border-0 border-end-0'
  li.dataset.feedUrl = feedURL

  const h3 = document.createElement('h3')
  h3.className = 'h6 m-0'
  h3.textContent = title

  const p = document.createElement('p')
  p.className = 'm-0 small text-black-50'
  p.textContent = description

  li.append(h3, p)
  return li
}

const makeFeedsMetaUlElement = (rssContents) => {
  const ul = document.createElement('ul')
  ul.className = 'list-group border-0 rounded-0'

  const listItems = rssContents
    .map(({ feedMeta }) => makeFeedsMetaLiElement(feedMeta))

  ul.append(...listItems)
  return ul
}

const makePostsLiElement = (feedItem) => {
  const { feedURL, title, pubDate } = feedItem

  const li = document.createElement('li')
  li.className
    = 'list-group-item d-flex justify-content-between align-items-start border-0 border-end-0'
  
  const a = document.createElement('a')
  a.className = 'fw-bold'
  a.dataset.feedUrl = feedURL
  a.href = '#'
  a.textContent = `${title} ${pubDate}`

  li.append(a)
  return li
}

const makePostsUlElement = (rssContents) => {
  const ul = document.createElement('ul')
  ul.className = 'list-group border-0 rounded-0'

  const listItems = rssContents
    .flatMap(({ feedItems }) => feedItems)
    .map(makePostsLiElement)

  ul.append(...listItems)
  return ul
}

const renderFeedsMeta = (elements, rssContents) => {
  const { feedsContainer } = elements

  const titleCard = makeTitleCardElement('Фиды')
  const ul = makeFeedsMetaUlElement(rssContents)

  feedsContainer.replaceChildren(titleCard, ul)
}

const renderPosts = (elements, rssContents) => {
  const { postsContainer } = elements

  const titleCard = makeTitleCardElement('Посты')
  const ul = makePostsUlElement(rssContents)

  postsContainer.replaceChildren(titleCard, ul)
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
  document.querySelector('#app').innerHTML = rssAggregatorFormHTML
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
    if (state.updatingProcess.processState === 'updating') return

    const data = { url: state.form.fields.url }
    if (state.feedURLs.includes(data.url)) {
      state.form.validationErrors = { url: { message: 'RSS уже добавлен' } }
      return
    }
    state.feedURLs = [...state.feedURLs, data.url]

    state.updatingProcess.processError = null
    state.updatingProcess.processState = 'updating'

    updateFeeds(state)
  })
}