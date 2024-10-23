import { defineNuxtConfig } from 'nuxt/config'
import Aura from '@primevue/themes/aura'

const isProduction = process.env.NODE_ENV === 'production'

// https://nuxt.com/docs/api/nuxt-config
export default defineNuxtConfig({
  build: {
    // fixing @babel/runtime issue in production build
    transpile: [...(isProduction ? ['@babel/runtime'] : [])],
  },

  modules: [
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxtjs/color-mode',
    '@nuxtjs/device',
    '@nuxtjs/supabase',
    '@pinia/nuxt',
    '@primevue/nuxt-module',
    '@nuxtjs/tailwindcss',
  ],

  fonts: {
    families: [{ name: 'Dosis', provider: 'google' }],
  },

  supabase: {
    redirect: false,
  },

  primevue: {
    options: {
      theme: {
        preset: Aura,
      },
    },
  },

  runtimeConfig: {
    public: {
      appName: process.env.APP_NAME,
      appDesc: process.env.APP_DESC,
      baseUrl: process.env.BASE_URL,
      donate: process.env.DONATE || 'https://www.buymeacoffee.com/anhthang',
    },
  },

  routeRules: {
    // pages generated on demand once until next deployment, cached on CDN
    '/about': { isr: true },
    '/policy': { isr: true },
  },
})
