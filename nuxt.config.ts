import { defineNuxtConfig } from 'nuxt/config'

const isProduction = process.env.NODE_ENV === 'production'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  build: {
    // fixing @babel/runtime issue in production build
    transpile: [...(isProduction ? ['@babel/runtime'] : [])],
  },

  modules: [
    '@buianhthang/nuxt',
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxtjs/color-mode',
    '@nuxtjs/device',
    '@nuxtjs/supabase',
    '@pinia/nuxt',
  ],

  colorMode: {
    preference: 'dark',
  },

  fonts: {
    families: [{ name: 'Cabin', provider: 'google' }],
  },

  supabase: {
    redirect: false,
  },

  runtimeConfig: {
    public: {
      appName: process.env.APP_NAME,
      appDesc: process.env.APP_DESC,
      baseUrl: process.env.BASE_URL,
    },
  },

  routeRules: {
    // pages generated on demand once until next deployment, cached on CDN
    '/about': { isr: true },
    '/policy': { isr: true },
  },
})
