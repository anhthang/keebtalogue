<template>
  <a-list
    item-layout="horizontal"
    :pagination="{ pageSize: 5, size: 'small' }"
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
              <a-avatar :src="item.img || item.render_img" shape="square">
                {{ item.name.charAt(0).toUpperCase() }}
              </a-avatar>
            </template>
          </a-list-item-meta>
          <div>
            {{ item.timeline }}
          </div>
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
