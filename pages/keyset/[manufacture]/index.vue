<template>
  <div class="container artisan-container">
    <a-spin :spinning="pending">
      <a-page-header title="GMK">
        <a-row :gutter="[8,8]" type="flex">
          <a-col
            v-for="keyset in keysets"
            :key="keyset.id"
            :xs="12"
            :sm="12"
            :md="8"
            :xl="6"
          >
            <nuxt-link :to="`/keyset/${keyset.slug}`">
              <a-card hoverable :title="keyset.name" :size="size">
                <template #cover>
                  <img loading="lazy" :alt="keyset.name" :src="keyset.img" />
                </template>
                <!-- <a-card-meta :title="keyset.name" :description="keyset.designer" /> -->
              </a-card>
            </nuxt-link>
          </a-col>
        </a-row>
      </a-page-header>
    </a-spin>
  </div>
</template>

<script setup>

const { $device } = useNuxtApp();
const { isMobile } = $device;
const size = isMobile ? "small" : "default";

useHead({
  title: "GMK Keycaps",
});

const route = useRoute();

const {
  data: keysets,
  pending,
  refresh,
} = await useAsyncData(() => $fetch(`/api/keysets?query=${route.params.manufacture}`));
</script>