<template>
  <a-config-provider :theme="themeCfg">
    <NuxtLayout :name="layout">
      <SpeedInsights />
      <NuxtPage />
    </NuxtLayout>
  </a-config-provider>
</template>

<script setup>
import { SpeedInsights } from '@vercel/speed-insights/nuxt'
import { theme } from 'ant-design-vue'
import { useUserStore } from './stores/user'
import 'ant-design-vue/dist/reset.css'

const { isMobile, isTablet } = useDevice()

let layout = 'desktop'
if (isMobile) {
  layout = 'mobile'
} else if (isTablet) {
  layout = 'tablet'
}

const themeCfg = ref({
  algorithm: theme.defaultAlgorithm,
  token: {
    fontFamily: 'Cabin, sans-serif;',
  },
})

const colorMode = useColorMode()

const getAlgorithm = (preference) => {
  switch (preference) {
    case 'dark':
      return theme.darkAlgorithm
    case 'light':
      return theme.defaultAlgorithm
    default:
      return colorMode.value === 'dark'
        ? theme.darkAlgorithm
        : theme.defaultAlgorithm
  }
}

watch(
  () => colorMode.value,
  () => {
    themeCfg.value.algorithm = getAlgorithm(colorMode.preference)
  },
)

onMounted(() => {
  const preference = localStorage.getItem('nuxt-color-mode')
  themeCfg.value.algorithm = getAlgorithm(preference)
})

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

<style>
.ant-spin-nested-loading {
  min-height: 300px;
}

.ant-layout-header {
  display: flex;
  align-items: center;
  padding: 0 24px !important;
}

.ant-layout-header .ant-menu {
  flex: 1;
}

.nuxt-icon svg {
  font-size: 18px;
}

.ant-typography {
  text-align: justify;
}

.ant-input-number,
.ant-input-number-affix-wrapper {
  width: 100%;
}
</style>
