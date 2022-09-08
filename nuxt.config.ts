import { defineNuxtConfig } from 'nuxt'
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
    ssr: false,
    target: 'static',

    css: ['ant-design-vue/dist/antd.css', 'ant-design-vue/dist/antd.dark.css'],

    modules: [
        '@nuxtjs/color-mode',
        '@nuxtjs/google-fonts',
        '@nuxtjs/supabase',
        '@nuxtjs/tailwindcss',
        '@pinia/nuxt',
        'nuxt-icons',
    ],

    googleFonts: {
        families: {
            Nunito: true,
        },
    },

    vite: {
        plugins: [
            Components({
                // add option {resolveIcons: true} as parameter for resolving problem with icons
                resolvers: [AntDesignVueResolver({ resolveIcons: true })],
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
            baseUrl: process.env.BASE_URL,
        },
    },
})
