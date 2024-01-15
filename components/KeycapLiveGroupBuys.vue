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
            :description="item.designer"
          >
            <template #avatar>
              <a-avatar
                :src="`/logo/${item.profile_id}.png`"
                shape="square"
                :class="$colorMode.value === 'dark' ? 'invertible-logo' : ''"
              >
                {{ item.name.charAt(0).toUpperCase() }}
              </a-avatar>
            </template>
          </a-list-item-meta>
          <template #extra>
            {{ formatDateRange(item.start_date, item.end_date) }}
          </template>
        </a-list-item>
      </nuxt-link>
    </template>
  </a-list>
</template>

<script setup>
const { keycaps } = defineProps({
  keycaps: {
    type: Object,
    default() {
      return {}
    },
  },
})
</script>

<style>
.ant-avatar img {
  object-fit: contain;
}
</style>
