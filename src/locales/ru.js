export default {
  translation: {
    app: {
      title: 'RSS Aggregator',
      lead: 'Начните читать RSS сегодня! Это легко, это красиво.',
      exampleURL: 'Пример: https://lorem-rss.hexlet.app/feed',
    },
    form: {
      urlInput: 'Ссылка RSS',
      urlPlaceholder: 'Ссылка RSS',
      addFeed: 'Добавить',
    },
    contents: {
      feeds: { title: 'Фиды' },
      posts: { title: 'Посты', preview: 'Просмотр' },
    },
    postPreviewModal: {
      close: 'Закрыть',
      link: 'Читать полностью',
    },
    validation : {
      mixed: {
        required: 'Не должно быть пустым',
      },
      string: {
        url: 'Ссылка должна быть валидным URL',
      },
      custom: {
        uniqueURL: 'RSS уже существует',
      },
    }
  },
}