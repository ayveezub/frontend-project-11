import i18next from 'i18next'
import resources from './locales/index.js'

const defaultLng = 'ru'
const i18nextInstance = i18next.createInstance()

const i18nextInstanceInit = () => i18nextInstance
  .init({
    lng: defaultLng,
    resources,
  })

export { i18nextInstance, i18nextInstanceInit }