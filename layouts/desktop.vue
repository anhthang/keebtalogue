<template>
  <a-layout has-sider>
    <SpeedInsights />

    <a-layout-sider
      :style="{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
      }"
      collapsed
    >
      <layout-sider style="height: 100%" />
    </a-layout-sider>
    <a-layout style="margin-left: 80px">
      <a-layout-header style="background: transparent">
        <a-flex justify="center" style="width: 100%">
          <search-box style="width: 40%; max-width: 800px" />
        </a-flex>
      </a-layout-header>
      <a-layout-content :style="{ overflow: 'initial' }">
        <NuxtPage />
      </a-layout-content>
      <a-layout-footer>
        <layout-footer />
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>

<script setup>
import { SpeedInsights } from '@vercel/speed-insights/nuxt'
</script>
