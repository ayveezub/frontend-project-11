const makeForm = (i18nextInstance) => {
  const i18 = i18nextInstance
  const section = document.createElement('section')
  section.className = 'container-fluid bg-dark p-5'
  section.innerHTML = `
    <div class="row">
      <div class="col-md-10 col-lg-8 mx-auto text-white">
        <h1 class="display-3 mb-0">${i18.t('app.title')}</h1>
        <p class="lead">
          ${i18.t('app.lead')}
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
                  placeholder="${i18.t('form.urlPlaceholder')}"
                  autocomplete="off"
                >
                <label for="url-input">${i18.t('form.urlInput')}</label>
              </div>
            </div>
            <div class="col-auto">
              <button
                type="submit"
                aria-label="add"
                class="h-100 btn btn-lg btn-primary px-sm-5"
              >
                ${i18.t('form.addFeed')}
              </button>
            </div>
          </div>
        </form>
        <p class="mt-2 mb-0 text-secondary">
          ${i18.t('app.exampleURL')}
        </p>
        <p class="feedback m-0 position-absolute small text-danger"></p>
      </div>
    </div>
  `

  return section
}

const makeContentContainer = () => {
  const section = document.createElement('section')
  section.className = 'container-fluid container-xxl p-5'
  section.innerHTML = `
    <div class="row">
      <div class="col-md-10 col-lg-8 order-1 mx-auto posts"></div>
      <div class="col-md-10 col-lg-4 max-auto order-0 order-lg-1 feeds"></div>
    </div>
  `

  return section
}

const makeInitialHomePage = (i18nextInstance) => {
  const main = document.createElement('main')
  main.className = 'flex-grow-1'

  const form = makeForm(i18nextInstance)
  const contentContainer = makeContentContainer()

  main.append(form, contentContainer)
  return main
}

const makeTitleCardElement = (title) => {
  const div = document.createElement('div')
  div.className = 'card-body'

  const h2 = document.createElement('h2')
  h2.className = 'card-title h4'
  h2.textContent = title

  div.append(h2)
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

export {
  makeInitialHomePage,
  makeTitleCardElement,
  makeFeedsMetaUlElement,
  makePostsUlElement,
}