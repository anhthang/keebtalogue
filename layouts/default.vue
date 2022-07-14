<template>
  <a-layout>
    <a-layout-header :class="isMobile ? 'mobile' : ''">
      <a-button
        v-if="isMobile"
        type="link"
        ghost
        :icon="collapsed ? 'menu-unfold' : 'menu-fold'"
        class="sidebar-toggle"
        @click="sidebarToogle"
      />

      <nuxt-link to="/">
        <div class="logo">Keeb Catalogue</div>
      </nuxt-link>

      <menu-tree v-if="!isMobile" mode="horizontal" />

      <!-- <right-header /> -->
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

<script>
import LayoutFooter from '~/components/layouts/Footer.vue'
import MenuTree from '~/components/layouts/MenuTree.vue'
// import RightHeader from '~/components/layouts/RightHeader.vue'

export default {
  components: { MenuTree, LayoutFooter },
  data() {
    return {
      // isMobile: this.$device.isMobile,
      isMobile: false,
      collapsed: true,
    }
  },
  methods: {
    sidebarToogle() {
      this.collapsed = !this.collapsed
    },
  },
}
</script>

<style>
.logo {
  height: 100%;
  font-size: 24px;
  /* color: @text-color-dark; */
  margin-right: 24px;
  font-weight: 700;
}

.ant-layout-header {
	 display: flex;
	 align-items: center;
	 padding: 0 24px !important;
}
 .ant-layout-header.mobile {
	 justify-content: space-between;
}
 .ant-layout-header.mobile .logo {
	 margin-right: 0;
}
 .ant-layout-header .ant-menu {
	 flex: 1;
}
</style>