<template>
  <a-config-provider
    :theme="{
      algorithm: theme.darkAlgorithm,
      token: seedToken,
    }"
  >
    <NuxtLayout :name="layout">
      <NuxtPage />
    </NuxtLayout>
  </a-config-provider>
</template>

<script setup>
import { theme } from 'ant-design-vue'
import { useUserStore } from './stores/user'
import '@/assets/app.css'
import 'ant-design-vue/dist/reset.css'

const { $device } = useNuxtApp()
const { isMobile, isTablet } = $device

let layout = 'desktop'
if (isMobile) {
  layout = 'mobile'
} else if (isTablet) {
  layout = 'tablet'
}

const seedToken = {
  fontFamily: "'Titillium Web', sans-serif;",
}

const config = useRuntimeConfig()
const userStore = useUserStore()

const client = useSupabaseClient()

client.auth.getSession().then(({ data }) => {
  if (data.session && data.session.user) {
    userStore.setCurrentUser(data.session.user)
  }
})

client.auth.onAuthStateChange((event, session) => {
  switch (event) {
    case 'SIGNED_IN':
      userStore.setCurrentUser(session.user)
      break
    case 'SIGNED_OUT':
      userStore.$reset()
      break
    case 'TOKEN_REFRESHED':
    case 'USER_UPDATED':
    case 'USER_DELETED':
    case 'PASSWORD_RECOVERY':
    default:
      break
  }
})

const { appName, appDesc, baseUrl } = config.public

useHead({
  htmlAttrs: {
    lang: 'en',
  },
  link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
})

useSeoMeta({
  titleTemplate: (chunk) => {
    return chunk ? `${chunk} - ${appName}` : appName
  },
  description: appDesc,
  ogType: 'website',
  ogUrl: baseUrl,
  ogTitle: appName,
  ogDescription: appDesc,
  ogImage: `${baseUrl}/website-card.png`,
  twitterCard: 'summary_large_image',
  twitterTitle: appName,
  twitterDescription: appDesc,
  twitterImage: `${baseUrl}/website-card.png`,
})
</script>
