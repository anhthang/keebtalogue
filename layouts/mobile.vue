<template>
  <a-layout>
    <SpeedInsights />

    <a-layout-header
      class="mobile"
      :style="{ background: token.colorBgLayout }"
    >
      <a-button type="text" @click="sidebarToogle">
        <template #icon>
          <menu-unfold-outlined />
        </template>
      </a-button>
      <a-drawer
        v-model:open="visible"
        placement="left"
        :style="{ background: token.colorBgLayout }"
      >
        <layout-sider @click="sidebarToogle" />
      </a-drawer>

      <nuxt-link to="/">
        <img src="/icon.png" alt="logo" height="40px" />
      </nuxt-link>

      <layout-right-header />
    </a-layout-header>

    <a-layout>
      <a-layout-content>
        <NuxtPage />
      </a-layout-content>
    </a-layout>

    <a-back-top />

    <a-layout-footer>
      <layout-footer />
    </a-layout-footer>
  </a-layout>
</template>

<script setup>
import { theme } from 'ant-design-vue'

import { SpeedInsights } from '@vercel/speed-insights/nuxt'
const { token } = theme.useToken()

const visible = ref(false)
const sidebarToogle = () => {
  visible.value = !visible.value
}
</script>

<style>
.mobile {
  justify-content: space-between;
}
</style>
