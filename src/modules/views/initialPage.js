import { i18nextInstance as i18 } from "../../app/i18"

const makeForm = () => {
  const section = document.createElement('section')
  section.className = 'container-fluid bg-dark p-5'
  section.innerHTML = `
    <div class="row">
      <div class="col-md-10 col-lg-8 mx-auto text-white">
        <h1 class="display-3 mb-0">${i18.t('app.title')}</h1>
        <p class="lead">
          ${i18.t('app.lead')}
        </p>
        <form class="rss-form text-body" action="" autocomplete="off">
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

const makeContentsContainer = () => {
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

const makePostPreviewModal = () => {
  const dialog = document.createElement('dialog')

  const attrs = { id: 'post-preview-modal' }
  Object
    .entries(attrs)
    .forEach(([key, value]) => dialog.setAttribute(key, value))

  dialog.innerHTML = `
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="modal-title"></h5>
          <button type="button" class="btn-close modal-close" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <p id="modal-body-text"></p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary" id="modal-link">
            ${i18.t('postPreviewModal.link')}
          </button>
          <button type="button" class="btn btn-secondary modal-close">
            ${i18.t('postPreviewModal.close')}
          </button>
        </div>
      </div>
    </div>
  `
  
  return dialog
}

export default () => {
  const main = document.createElement('main')
  main.className = 'flex-grow-1'

  const form = makeForm()
  const contentsContainer = makeContentsContainer()
  main.append(form, contentsContainer)

  const postPreviewModal = makePostPreviewModal()
  document.querySelector('#app').replaceChildren(main, postPreviewModal)
}