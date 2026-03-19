import i18next from 'i18next'
import resources from '../locales'

const defaultLng = 'ru'

const i18nextInstance = i18next.createInstance()

const i18nextInstanceInit = () => i18nextInstance
  .init({
    lng: defaultLng,
    resources,
  })

export { i18nextInstance, i18nextInstanceInit }