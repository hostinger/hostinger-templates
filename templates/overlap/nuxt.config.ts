export default defineNuxtConfig({
  compatibilityDate: '2026-08-01',
  ssr: true,
  modules: ['@nuxt/eslint'],
  css: [
    '@fontsource-variable/outfit/index.css',
    '~/assets/styles/main.css',
  ],
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      title: 'Overlap — find the hours that work for everyone',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content:
            'Add cities and see the hours that actually work for everyone. A timezone overlap tool for distributed teams and long-distance friends — shareable via URL.',
        },
        { name: 'theme-color', content: '#12142e' },
      ],
    },
  },
})
