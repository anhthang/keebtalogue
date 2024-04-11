<template>
  <a-list
    item-layout="horizontal"
    :pagination="makers.length > 5 ? { pageSize: 5, size: 'small' } : false"
    :data-source="makers"
  >
    <template #renderItem="{ item }">
      <nuxt-link :to="`/artisan/maker/${item.id}`">
        <a-list-item>
          <a-list-item-meta :title="item.name">
            <template #avatar>
              <a-avatar
                :src="`/logo/${item.id}.png`"
                shape="square"
                :class="
                  item.invertible_logo && $colorMode.value === 'dark'
                    ? 'invertible-logo'
                    : ''
                "
              >
                {{ item.name.charAt(0).toUpperCase() }}
              </a-avatar>
            </template>
          </a-list-item-meta>
          <template #extra>
            {{
              item.additions === 1
                ? '1 addition'
                : `${item.additions} additions`
            }}
          </template>
        </a-list-item>
      </nuxt-link>
    </template>
  </a-list>
</template>

<script setup>
const { makers } = defineProps({
  makers: {
    type: Object,
    default: () => ({}),
  },
})
</script>

<style>
.ant-avatar img {
  object-fit: contain;
}

.invertible-logo {
  filter: invert();
}
</style>
