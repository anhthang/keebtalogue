<template>
  <a-menu
    theme="dark"
    :mode="mode"
    :default-selected-keys="['1']"
    :style="{ lineHeight: '64px' }"
    @click="onChangeMenu"
  >
    <a-menu-item key="1">
      <nuxt-link to="/"><a-icon type="calendar" />Calendar </nuxt-link>
    </a-menu-item>

    <a-sub-menu key="2">
      <template #title>
        <a-icon :component="KeyboardSvg" class="custom-icon" /> Keebs
      </template>
      <a-menu-item key="3">
        <nuxt-link to="/keebs"> <a-icon type="forward" />Live GBs </nuxt-link>
      </a-menu-item>
      <a-menu-item key="4">
        <nuxt-link to="/keebs?status=ic">
          <a-icon type="question-circle" />Interest Check
        </nuxt-link>
      </a-menu-item>
      <a-menu-item key="5">
        <nuxt-link to="/keebs?status=closed">
          <a-icon type="backward" />Previous GBs
        </nuxt-link>
      </a-menu-item>
      <a-menu-divider />
      <a-menu-item key="2.1">
        <nuxt-link to="/keebs/maker">
          <a-icon type="user-add" />Makers
        </nuxt-link>
      </a-menu-item>
    </a-sub-menu>

    <a-sub-menu key="6">
      <template #title><a-icon type="user" /> Artisans </template>
      <a-menu-item key="7">
        <nuxt-link to="/artisans/maker">
          <a-icon type="user-add" />Makers
        </nuxt-link>
      </a-menu-item>
      <a-menu-item key="8">
        <nuxt-link to="/artisans/collection">
          <a-icon type="book" />Collection
        </nuxt-link>
      </a-menu-item>
      <a-menu-item key="9">
        <nuxt-link to="/artisans/wishlist">
          <a-icon type="shopping-cart" />Wishlist
        </nuxt-link>
      </a-menu-item>
    </a-sub-menu>
  </a-menu>
</template>

<script>
// import KeyboardSvg from '@/components/icons/KeyboardSvg'

export default {
  props: {
    mode: {
      type: String,
      required: true,
    },
  },
  // data() {
  //   return {
  //     KeyboardSvg,
  //   }
  // },
  // methods: {
  //   onChangeMenu() {
  //     if (this.$device.isMobile) {
  //       this.$emit('click')
  //     }
  //   },
  // },
}
</script>
