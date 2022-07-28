import { defineNuxtConfig } from 'nuxt'
import Components from 'unplugin-vue-components/vite';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  css: ['@/assets/main.less'],

  modules: ['@pinia/nuxt', '@nuxtjs/color-mode', '@nuxtjs/google-fonts'],

  googleFonts: {
    families: {
      Nunito: true,
    }
  },

  vite: {
    plugins: [
      Components({
        // add option {resolveIcons: true} as parameter for resolving problem with icons
        resolvers: [AntDesignVueResolver({resolveIcons: true})],
      }),
    ],
    // @ts-expect-error: Missing ssr key
    ssr: {
      noExternal: ['moment', 'compute-scroll-into-view', 'ant-design-vue','@ant-design/icons-vue'],
    },
  },

  runtimeConfig: {
    public: {
      appName: process.env.APP_NAME,
      baseUrl: process.env.BASE_URL,
      firebase: {
        apiKey: process.env.FIREBASE_API_KEY,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN,
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.FIREBASE_APP_ID,
        measurementId: process.env.FIREBASE_MEASUREMENT_ID,
      }
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    loaders: {
      less: {
        lessOptions: {
          javascriptEnabled: true,
        },
      },
    },
  },
})
