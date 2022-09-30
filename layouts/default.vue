<template>
  <a-layout>
    <a-layout-header :class="isMobile ? 'mobile' : ''">
      <a-button
        v-if="isMobile"
        ghost
        class="sidebar-toggle"
        @click="sidebarToogle"
      >
        <template #icon>
          <menu-unfold-outlined v-if="collapsed" />
          <menu-fold-outlined v-else />
        </template>
      </a-button>

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

      <menu-tree v-if="!isMobile" mode="horizontal" />

      <right-header />
    </a-layout-header>

    <a-layout>
      <a-layout-sider
        v-if="isMobile"
        :collapsed="collapsed"
        collapsed-width="0"
      >
        <menu-tree mode="inline" @click="sidebarToogle" />
      </a-layout-sider>

      <a-layout-content>
        <NuxtPage />
      </a-layout-content>
    </a-layout>

    <a-layout-footer>
      <layout-footer />
    </a-layout-footer>
  </a-layout>
</template>

<script setup>
import LayoutFooter from "~~/components/layouts/Footer.vue";
import MenuTree from "~~/components/layouts/MenuTree.vue";
import RightHeader from "~~/components/layouts/RightHeader.vue";

const { $device } = useNuxtApp();
const { isMobile, isMobileOrTablet } = $device;

const collapsed = ref(true);
const sidebarToogle = () => {
  collapsed.value = !collapsed.value;
};

const config = useRuntimeConfig();
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
  font-family: "Bungee Spice", cursive;
}

.logo img {
  width: 48px;
  margin-right: 16px;
}
</style>