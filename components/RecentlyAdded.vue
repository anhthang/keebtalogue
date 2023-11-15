<template>
  <a-list
    item-layout="horizontal"
    :pagination="{ pageSize: 5, size: 'small' }"
    :data-source="data"
  >
    <template #renderItem="{ item }">
      <a-list-item>
        <a-list-item-meta>
          <template #title>
            <nuxt-link :to="`/artisan/maker/${item.id}`">
              {{ item.name }}
            </nuxt-link>
          </template>
          <template #avatar>
            <a-avatar
              :src="`/logo/${item.id}.png`"
              shape="square"
              :class="item.invertible_logo ? 'invertible-logo' : ''"
            />
          </template>
        </a-list-item-meta>
        <div>
          {{
            item.additions === 1 ? '1 addition' : `${item.additions} additions`
          }}
        </div>
      </a-list-item>
    </template>
  </a-list>
</template>

<script setup>
const { data } = await useAsyncData(() => $fetch('/api/statistics'))
</script>

<style>
.ant-avatar img {
  object-fit: contain;
}

.invertible-logo {
  filter: invert();
}
</style>
