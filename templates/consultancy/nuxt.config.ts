import site from './app/data/site.json'

export default defineNuxtConfig({
  modules: ['@nuxt/eslint'],
  css: ['~/assets/css/main.css'],
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      title: `${site.name} — ${site.role}`,
      meta: [
        { name: 'description', content: site.metaDescription },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#f2eddf' },
      ],
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    },
  },
  nitro: {
    prerender: {
      crawlLinks: true,
    },
  },
})
