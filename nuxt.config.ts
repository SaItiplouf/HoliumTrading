// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss'],
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  runtimeConfig: {
    // apiSecret: '',
    public: {
      alphaVantageKey: process.env.STOCK_API_KEY,
    }
  }
})