import renderInitialPage from './initialPage'
import { renderValidationErrors } from './feedback'
import renderFeedsMeta from './feedsMeta'
import renderPosts from './posts'
import { state, subscribe } from '../../app/state'

const watchForStateChanges = (elements) => subscribe(state, (ops) => {
  ops.forEach((op) => {
    const [, path, value, prevValue] = op
    const pathString = path.join('.')

    switch (pathString) {
      case 'form.validationErrors':
        renderValidationErrors(elements, value, prevValue)
        break

      case 'rssContents':
        renderFeedsMeta(elements, value)
        renderPosts(elements, value)
        break

      default:
        break
    }
  })
})

export { renderInitialPage, watchForStateChanges }