<template>
  <div class="container artisan-container">
    <a-spin :spinning="pending">
      <a-page-header :title="manufacturers[$route.params.manufacture]">
        <template #extra>
          <a-pagination
            v-model:current="page"
            :total="data.count"
            :page-size="size"
            :show-size-changer="false"
          />
        </template>

        <a-row :gutter="[8, 8]" type="flex">
          <a-col
            v-for="keycap in data.keycaps"
            :key="keycap.id"
            :xs="12"
            :sm="12"
            :md="8"
            :xl="6"
          >
            <nuxt-link :to="`/keycap/${keycap.slug}`">
              <a-card
                hoverable
                :title="keycap.name"
                :head-style="artisanCardHeadStyle"
              >
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
const route = useRoute()
const manufacturers = {
  gmk: 'GMK',
  sa: 'SA',
  jtk: 'JTK',
}

useSeoMeta({
  title: manufacturers[route.params.manufacture],
})

const page = ref(1)
const size = ref(24)

const { data, pending } = await useAsyncData(
  () =>
    $fetch('/api/keycaps', {
      query: {
        query: route.params.manufacture,
        page: page.value,
        size: size.value,
      },
    }),
  {
    watch: [page, size],
  },
)
</script>
