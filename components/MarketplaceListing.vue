<template>
  <a-list
    item-layout="vertical"
    :data-source="data"
    :pagination="{ pageSize: 10, size: 'small' }"
  >
    <template #renderItem="{ item }">
      <a-list-item>
        <template #actions>
          <span> <comment-outlined /> {{ item.contact }} </span>
          <span>
            <history-outlined /> {{ formatDateTime(item.created_at) }}
          </span>
        </template>

        <a-typography-text strong>Wants:</a-typography-text>
        {{ item.message }}

        <template #extra>
          <a-avatar-group shape="square" :max-count="8" size="large">
            <a-tooltip
              v-for="cap in item.items"
              :key="cap.id"
              :title="colorwayTitle(cap)"
            >
              <a-avatar :alt="colorwayTitle(cap)" :src="cap.img" />
            </a-tooltip>
          </a-avatar-group>
        </template>
      </a-list-item>
    </template>
  </a-list>
</template>

<script setup>
const { data } = defineProps({
  data: {
    type: Array,
    default() {
      return []
    },
  },
})
</script>
