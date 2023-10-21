<template>
  <a-layout>
    <a-layout-header class="tablet">
      <nuxt-link to="/">
        <div class="logo">
          {{ config.public.appName }}
        </div>
      </nuxt-link>

      <layout-menu-tree mode="horizontal" />

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
const config = useRuntimeConfig()
</script>

<style>
/* .tablet {
  justify-content: space-between;
} */

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
