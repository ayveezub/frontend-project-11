import * as yup from 'yup'
import { state } from './state'
import {
  i18nextInstance,
  i18nextInstanceInit,
  yupLocale,
} from './i18'
import app from './App'

export default () => i18nextInstanceInit()
  .then(() => yup.setLocale(yupLocale))
  .finally(() => app(state, i18nextInstance))