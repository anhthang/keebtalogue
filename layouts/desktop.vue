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
        // marginTop: '64px',
      }"
      collapsed
    >
      <layout-sider style="height: 100%" />
    </a-layout-sider>
    <a-layout style="margin-left: 80px">
      <a-layout-header style="background: transparent">
        <a-flex justify="center" style="width: 100%">
          <search-box style="width: 40%" />
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

<style>
.logo {
  font-size: 24px;
  margin-right: 24px;
  font-family: 'Bungee Spice', cursive;
}

.logo img {
  width: 48px;
  margin-right: 16px;
}

.fixed-sider {
  overflow: auto;
  height: 100vh;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>
