<template>
  <a-list
    item-layout="horizontal"
    :pagination="keycaps.length > 5 ? { pageSize: 5, size: 'small' } : false"
    :data-source="keycaps"
  >
    <template #renderItem="{ item }">
      <nuxt-link :to="`/keycap/${item.profile_keycap_id}`">
        <a-list-item>
          <a-list-item-meta
            :title="`${manufacturers[item.profile_id]} ${item.name}`"
          >
            <template #avatar>
              <a-avatar
                :src="`/logo/${item.profile_id}.png`"
                shape="square"
                size="large"
                :class="{ invert: $colorMode.value === 'dark' }"
              >
                {{ item.name.charAt(0).toUpperCase() }}
              </a-avatar>
            </template>
            <template #description>
              {{ formatDateRange(item.start_date, item.end_date) }}
            </template>
          </a-list-item-meta>
        </a-list-item>
      </nuxt-link>
    </template>
  </a-list>
</template>

<script setup>
const { keycaps } = defineProps({
  keycaps: {
    type: Object,
    default: () => ({}),
  },
})
</script>

<style>
.ant-avatar img {
  object-fit: contain;
}
</style>
