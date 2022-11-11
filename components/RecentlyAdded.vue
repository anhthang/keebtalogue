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
            <a-avatar :src="`/logo/${$colorMode.value}/${item.id}.png`" />
          </template>
        </a-list-item-meta>
        <div>
          {{
            item.additions === 1 ? "1 addition" : `${item.additions} additions`
          }}
        </div>
      </a-list-item>
    </template>
  </a-list>
</template>

<script setup>
const { data } = await useAsyncData(() => $fetch("/api/statistics"));
</script>