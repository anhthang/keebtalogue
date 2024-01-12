import { defineNuxtConfig } from 'nuxt/config'

const isProduction = process.env.NODE_ENV === 'production'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  build: {
    // fixing @babel/runtime issue in production build
    transpile: [...(isProduction ? ['@babel/runtime'] : [])],
  },

  modules: [
    '@ant-design-vue/nuxt',
    '@nuxt/content',
    '@nuxtjs/color-mode',
    '@nuxtjs/device',
    '@nuxtjs/google-fonts',
    '@nuxtjs/supabase',
    '@pinia/nuxt',
    'nuxt-icon',
  ],

  colorMode: {
    preference: 'dark',
  },

  googleFonts: {
    families: {
      'Bungee+Spice': true,
      Cabin: true,
    },
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
})
