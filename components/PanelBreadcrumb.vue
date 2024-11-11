<template>
  <Breadcrumb
    :model="breadcrumbs"
    pt:root:class="!border-0 !bg-transparent"
    :class="{
      'py-0': $device.isMobile,
      'pb-0': $device.isDesktopOrTablet,
    }"
  >
    <template #item="{ item, props }">
      <nuxt-link :to="item.route" v-bind="props.action">
        <i v-if="item.icon" :class="item.icon" /> {{ item.label }}
      </nuxt-link>
    </template>

    <template #separator>/</template>
  </Breadcrumb>
</template>

<script setup>
defineProps({
  breadcrumbs: {
    type: Array,
    default: undefined,
  },
})
</script>
