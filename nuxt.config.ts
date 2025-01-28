// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@prisma/nuxt'
  ],
  app: {
    head: {
      title: 'DevData',
      meta: [{ charset: 'utf-8' }],
    },
  },
})