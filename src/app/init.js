import { state } from './state'
import { i18nextInstance, i18nextInstanceInit } from './i18'
import app from './App'

export default () => i18nextInstanceInit()
  .then(() => app(state, i18nextInstance))