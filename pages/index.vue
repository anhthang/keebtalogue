<template>
  <div class="container">
    <a-page-header title="Overview">
      <a-typography-title :level="5">
        <history-outlined /> Recently Added
      </a-typography-title>
      <a-row :gutter="[8, 8]" type="flex">
        <a-col
          v-for="(additions, maker) in data"
          :key="maker"
          :xs="24"
          :sm="24"
          :md="8"
          :lg="6"
          :xl="4"
        >
          <nuxt-link :to="`/artisan/maker/${additions[0].maker_id}`">
            <a-card hoverable>
              <a-card-meta :title="maker">
                <template #avatar>
                  <a-avatar
                    :src="`/logo/${$colorMode.value}/${additions[0].maker_id}.png`"
                  />
                </template>
                <template v-if="additions.length === 1" #description>
                  1 addition
                </template>
                <template v-else #description>
                  {{ additions.length }} additions
                </template>
              </a-card-meta>
            </a-card>
          </nuxt-link>
        </a-col>
      </a-row>
    </a-page-header>
  </div>
</template>

<script setup>
const { data } = await useAsyncData(() => $fetch("/api/statistics"));
</script>
