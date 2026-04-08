import renderInitialPage from './initialPage'
import { renderFeedback, renderValidationErrors } from './feedback'
import renderFeeds from './feeds'
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

      case 'posts':
        renderFeeds(elements)
        renderPosts(elements)
        break

      case 'updatingProcess':
        renderFeedback(elements, value)
        break

      default:
        break
    }
  })
})

export { renderInitialPage, watchForStateChanges }