import { defineNuxtConfig } from 'nuxt/config'
import Aura from '@primevue/themes/aura'
import { execSync } from 'child_process'
import app from './package.json'

const revision = execSync('git rev-parse --short HEAD').toString().trim()

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
    '@nuxt/image',
    '@nuxtjs/color-mode',
    '@nuxtjs/device',
    '@nuxtjs/supabase',
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@primevue/nuxt-module',
    'nuxt-og-image',
  ],

  // just to bypass vercel deployment to use `pg` instead
  content: {
    database: {
      type: 'd1',
      bindingName: app.name,
    },
  },

  fonts: {
    families: [{ name: 'Dosis', provider: 'google' }],
  },

  ogImage: {
    defaults: {
      component: 'Website',
    },
    fonts: ['Dosis:500', 'Dosis:600'],
  },

  supabase: {
    redirect: false,
  },

  primevue: {
    options: {
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: '.dark-mode',
        },
      },
    },
  },

  buildId: `v${app.version} (${revision})`,

  runtimeConfig: {
    app: {
      name: app.displayName,
      description: app.description,
      homepage: app.homepage,
    },
    public: {
      donate: app.funding.url,
    },
  },

  routeRules: {
    // pages generated on demand once until next deployment, cached on CDN
    '/about': { prerender: true },
    '/policy': { prerender: true },
  },
})
