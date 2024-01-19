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
        </template>

        <a-typography-text strong>Wants:</a-typography-text>
        {{ item.message }}

        <template #extra>
          <a-avatar-group shape="square">
            <a-tooltip
              v-for="cap in item.items.slice(0, 10)"
              :key="cap.id"
              :title="colorwayTitle(cap)"
            >
              <a-avatar :alt="colorwayTitle(cap)" :src="cap.img" size="large" />
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
