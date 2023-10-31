<template>
  <div class="container artisan-container">
    <a-spin :spinning="pending">
      <a-page-header :title="manufacturers[$route.params.manufacture]">
        <a-row :gutter="[8, 8]" type="flex">
          <a-col
            v-for="keycap in keycaps"
            :key="keycap.id"
            :xs="12"
            :sm="12"
            :md="8"
            :xl="6"
          >
            <nuxt-link :to="`/keycap/${keycap.slug}`">
              <a-card hoverable :title="keycap.name">
                <template #cover>
                  <img loading="lazy" :alt="keycap.name" :src="keycap.img" />
                </template>
                <!-- <a-card-meta :title="keycap.name" :description="keycap.designer" /> -->
              </a-card>
            </nuxt-link>
          </a-col>
        </a-row>
      </a-page-header>
    </a-spin>
  </div>
</template>

<script setup>
useSeoMeta({
  title: 'GMK Keycaps',
})

const route = useRoute()
const manufacturers = {
  gmk: 'GMK',
  sa: 'SA',
}

const { data: keycaps, pending } = await useAsyncData(() =>
  $fetch(`/api/keycaps?query=${route.params.manufacture}`),
)
</script>
