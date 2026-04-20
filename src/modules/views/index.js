import renderInitialPage from './initialPage'
import { renderFeedback, renderValidationErrors } from './feedback'
import renderFeeds from './feeds'
import { renderPosts, renderPostPreviewModal } from './posts'
import { state, subscribe } from '../../app/state'

const watchForStateChanges = (elements) => subscribe(state, (ops) => {
  ops.forEach((op) => {
    const [, path, value, prevValue] = op
    const pathString = path.join('.')
    if (pathString === 'form.validationErrors') {
      renderValidationErrors(elements, value, prevValue)
      return
    }
    if (
      pathString.startsWith('posts.')
      && pathString.endsWith('.touched')
    ) {
      renderPosts(elements)
      return
    }
    if (pathString === 'posts') {
      renderFeeds(elements)
      renderPosts(elements)
      return
    }
    if (pathString === 'updatingProcess') {
      renderFeedback(elements, value)
      return
    }
  })
})

export {
  renderInitialPage,
  renderPostPreviewModal,
  watchForStateChanges,
}