<template>
  <a-layout>
    <SpeedInsights />
    <a-layout-header
      :style="{
        position: 'fixed',
        zIndex: 1,
        width: '100%',
        background: token.colorBgLayout,
        borderBlockEnd: `1px solid ${token.colorSplit}`,
      }"
    >
      <a-flex justify="space-between" align="center" style="width: 100%">
        <img src="/logo-text.png" alt="logo" height="40px" />

        <search-box style="width: 40%; max-width: 800px" />

        <layout-right-header />
      </a-flex>
    </a-layout-header>

    <a-layout-content style="margin-top: 64px">
      <a-layout has-sider>
        <a-layout-sider
          style="
            overflow: auto;
            height: 100vh;
            position: fixed;
            left: 0;
            top: 0;
            bottom: 0;
            margin-top: 64px;
          "
          collapsed
        >
          <layout-sider style="height: 100%" />
        </a-layout-sider>
        <a-layout style="margin-left: 80px">
          <a-layout-content>
            <NuxtPage />
          </a-layout-content>
          <a-layout-footer>
            <layout-footer />
          </a-layout-footer>
        </a-layout>
      </a-layout>
    </a-layout-content>
  </a-layout>
</template>

<script setup>
import { theme } from 'ant-design-vue'
const { token } = theme.useToken()

import { SpeedInsights } from '@vercel/speed-insights/nuxt'
</script>
