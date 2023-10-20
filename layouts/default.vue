<template>
  <a-layout>
    <a-layout-header :class="isMobile ? 'mobile' : ''">
      <a-button v-if="isMobile" type="text" @click="sidebarToogle">
        <template #icon>
          <menu-unfold-outlined style="color: #f0f0f4" />
        </template>
      </a-button>
      <a-drawer v-if="isMobile" v-model:open="visible" placement="top">
        <menu-tree mode="inline" @click="sidebarToogle" />
      </a-drawer>

      <nuxt-link to="/">
        <div class="logo">
          <img
            v-if="!isMobileOrTablet"
            src="/icon.png"
            alt="logo"
            class="logo-icon"
          />
          {{ config.public.appName }}
        </div>
      </nuxt-link>

      <layout-menu-tree v-if="!isMobile" mode="horizontal" />

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
const { $device } = useNuxtApp()
const { isMobile, isMobileOrTablet } = $device

const visible = ref(false)
const sidebarToogle = () => {
  visible.value = !visible.value
}

const config = useRuntimeConfig()
</script>

<style>
.mobile {
  justify-content: space-between;
}

.mobile .logo {
  margin-right: 0;
}

.logo {
  height: 100%;
  font-size: 24px;
  margin-right: 24px;
  font-family: 'Bungee Spice', cursive;
}

.logo img {
  width: 48px;
  margin-right: 16px;
}
</style>
