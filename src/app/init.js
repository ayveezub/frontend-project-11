import { unstable_enableOp } from 'valtio/vanilla'
import * as yup from 'yup'
import {
  i18nextInstanceInit,
  yupCustomLocale,
} from './i18'
import app from './App'

export default () => i18nextInstanceInit()
  .then(() => yup.setLocale(yupCustomLocale))
  .then(() => unstable_enableOp(true))
  .finally(() => app())
