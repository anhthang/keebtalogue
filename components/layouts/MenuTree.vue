<template>
  <a-menu
    theme="dark"
    :mode="mode"
    :default-selected-keys="['1']"
    :style="{ lineHeight: '64px' }"
    @click="onChangeMenu"
  >
    <a-menu-item key="1">
      <nuxt-link to="/"><calendar-outlined /> Calendar </nuxt-link>
    </a-menu-item>

    <!-- <a-sub-menu key="2">
      <template #title> <insert-row-above-outlined /> Keebs </template>
      <a-menu-item key="3">
        <nuxt-link to="/keebs"> <forward-outlined /> Live GBs </nuxt-link>
      </a-menu-item>
      <a-menu-item key="4">
        <nuxt-link to="/keebs?status=ic">
          <question-circle-outlined /> Interest Check
        </nuxt-link>
      </a-menu-item>
      <a-menu-item key="5">
        <nuxt-link to="/keebs?status=closed">
          <backward-outlined /> Previous GBs
        </nuxt-link>
      </a-menu-item>
      <a-menu-divider />
      <a-menu-item key="2.1">
        <nuxt-link to="/keebs/maker"> <user-add-outlined /> Makers </nuxt-link>
      </a-menu-item>
    </a-sub-menu> -->

    <a-menu-item key="7">
      <nuxt-link to="/artisan/maker"> <user-add-outlined /> Makers </nuxt-link>
    </a-menu-item>
    <a-menu-item key="8">
      <nuxt-link to="/artisan/collection">
        <book-outlined /> Collection
      </nuxt-link>
    </a-menu-item>
    <a-menu-item key="9">
      <nuxt-link to="/artisan/wishlist">
        <shopping-cart-outlined /> Wishlist
      </nuxt-link>
    </a-menu-item>
  </a-menu>
</template>

<script>
export default {
  props: {
    mode: {
      type: String,
      required: true,
    },
  },
  methods: {
    onChangeMenu() {
      // if (this.$device.isMobile) {
      //   this.$emit('click')
      // }
    },
  },
};
</script>
