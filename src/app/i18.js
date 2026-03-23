import i18next from 'i18next'
import resources from '../locales'

const i18nextInstance = i18next.createInstance()

const defaultLng = 'ru'
const i18nextInstanceInit = () => i18nextInstance
  .init({
    lng: defaultLng,
    resources,
  })

const i18 = i18nextInstance
const yupCustomLocale = {
  mixed: {
    required: () => i18.t('validation.mixed.required'),
  },
  string: {
    url: () => i18.t('validation.string.url'),
  },
}

export {
  i18nextInstance,
  i18nextInstanceInit,
  yupCustomLocale,
}