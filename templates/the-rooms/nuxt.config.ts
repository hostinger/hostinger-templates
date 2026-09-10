export default defineNuxtConfig({
  compatibilityDate: '2026-08-01',
  ssr: true,
  modules: ['@nuxt/eslint'],
  nitro: {
    prerender: {
      routes: [
        '/',
        '/rooms/lookout',
        '/rooms/boat-house',
        '/rooms/salt-store',
      ],
    },
  },
  css: [
    '@fontsource-variable/newsreader/index.css',
    '@fontsource-variable/work-sans/index.css',
    '~/assets/styles/main.css',
  ],
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      title: 'The Rooms — a small guesthouse by the sea',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content:
            'Three thoughtful rooms above the harbour path, with seasonal rates, honest details, and direct booking enquiries.',
        },
        { name: 'theme-color', content: '#173742' },
      ],
    },
  },
})
