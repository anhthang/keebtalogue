<template>
  <Breadcrumb
    :model="breadcrumbs"
    pt:root:class="!border-0 !bg-transparent !pb-0"
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
