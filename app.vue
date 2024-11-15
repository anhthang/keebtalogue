<template>
  <NuxtLayout :name="$device.isMobile ? 'mobile' : 'desktop'">
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
import { useUserStore } from './stores/user'
import 'primeicons/primeicons.css'

const config = useRuntimeConfig()
const userStore = useUserStore()

const client = useSupabaseClient()

client.auth.getUser().then(({ data }) => {
  if (data.user) {
    userStore.setCurrentUser(data.user)
  } else {
    userStore.$reset()
  }
})

const { appName, appDesc, baseUrl } = config.public

useHead({
  htmlAttrs: {
    lang: 'en',
  },
  link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
})

defineOgImage()

useSeoMeta({
  titleTemplate: (chunk) => {
    return chunk ? `${chunk} - ${appName}` : appName
  },
  description: appDesc,
  ogType: 'website',
  ogUrl: baseUrl,
  ogTitle: appName,
  ogDescription: appDesc,
  twitterCard: 'summary_large_image',
  twitterTitle: appName,
  twitterDescription: appDesc,
})
</script>
