import { defineNuxtConfig } from 'nuxt/config'
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
    ssr: false, // use this until production build have no issues

    modules: [
        '@nuxtjs/color-mode',
        '@nuxt/content',
        '@nuxtjs/supabase',
        '@nuxtjs/tailwindcss',
        '@pinia/nuxt',
        'nuxt-icon',
    ],

    vite: {
        plugins: [
            Components({
                /**
                 * {resolveIcons: true}: resolving problem with icons
                 * {importStyle: false}: do not import css, do it manually for dark mode
                 */
                resolvers: [
                    AntDesignVueResolver({
                        resolveIcons: true,
                        importStyle: false,
                    }),
                ],
            }),
        ],
        ssr: {
            noExternal: [
                'moment',
                'compute-scroll-into-view',
                'ant-design-vue',
                '@ant-design/icons-vue',
            ],
        },
    },

    runtimeConfig: {
        public: {
            appName: process.env.APP_NAME,
            appDesc: process.env.APP_DESC,
            baseUrl: process.env.BASE_URL,
        },
    },
})
