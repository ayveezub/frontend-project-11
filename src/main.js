import './assets/styles/main.css'
import { i18nextInstance, i18nextInstanceInit } from './i18n.js'
import app from './application.js'

i18nextInstanceInit()
  .then(() => app(i18nextInstance))
