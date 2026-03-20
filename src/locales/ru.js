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
      feedsMeta: { title: 'Фиды' },
      posts: { title: 'Посты' },
    },
    validation : {
      mixed: {
        required: 'Не должно быть пустым',
      },
      string: {
        url: 'Ссылка должна быть валидным URL',
      },
      custom: {
        uniqueURL: 'RSS уже добавлен',
      },
    }
  },
}