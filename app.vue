<template>
  <a-config-provider
    :theme="{
      algorithm:
        $colorMode.value === 'dark'
          ? theme.darkAlgorithm
          : theme.defaultAlgorithm,
      token: seedToken,
    }"
  >
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </a-config-provider>
</template>

<script setup>
import { theme } from 'ant-design-vue'
import { useUserStore } from './stores/user'
import '@/assets/app.css'
import 'ant-design-vue/dist/reset.css'

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
  titleTemplate: (chunk) => {
    return chunk ? `${chunk} - ${appName}` : appName
  },
  meta: [
    // Primary Meta Tags
    { name: 'description', content: appDesc },
    // Open Graph / Facebook
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: baseUrl },
    { property: 'og:title', content: appName },
    { property: 'og:description', content: appDesc },
    { property: 'og:image', content: `${baseUrl}/website-card.png` },
    // Twitter
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:url', content: baseUrl },
    { name: 'twitter:title', content: appName },
    { name: 'twitter:description', content: appDesc },
    { name: 'twitter:image', content: `${baseUrl}/website-card.png` },
  ],
  link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
})
</script>
