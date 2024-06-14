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
        <nuxt-link to="/">
          <img src="/logo-filled.png" alt="logo" height="40px" />
        </nuxt-link>

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
          breakpoint="xxxl"
          collapsed-width="80"
          @breakpoint="onBreakpoint"
          @collapse="onCollapse"
        >
          <layout-sider style="height: 100%" />
        </a-layout-sider>
        <a-layout :style="{ marginLeft }">
          <a-layout-content>
            <NuxtPage />
          </a-layout-content>
          <a-layout-footer
            :style="{ borderBlockStart: `1px solid ${token.colorSplit}` }"
          >
            <layout-footer />
          </a-layout-footer>
        </a-layout>
      </a-layout>
    </a-layout-content>

    <a-back-top />
  </a-layout>
</template>

<script setup>
import { theme } from 'ant-design-vue'

import { SpeedInsights } from '@vercel/speed-insights/nuxt'
const { token } = theme.useToken()

const marginLeft = ref('80px')
const onBreakpoint = (broken) => {
  if (!broken) {
    marginLeft.value = '200px'
  }
}

const onCollapse = (collapse) => {
  if (collapse) {
    marginLeft.value = '80px'
  }
}
</script>
