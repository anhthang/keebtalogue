<template>
  <div class="container">
    <a-page-header title="Marketplace">
      <template #subTitle>
        <a-tooltip
          title="This feature is still under development, so you may experience bugs
            or incomplete functionality."
        >
          <a-tag color="blue">Experiment</a-tag>
        </a-tooltip>
      </template>
      <template v-if="$device.isDesktop" #extra>
        <nuxt-link to="/artisan/wishlist">
          <a-button type="primary">
            <file-image-outlined /> Create Wishlist
          </a-button>
        </nuxt-link>
      </template>

      <a-typography>
        <a-typography-paragraph>
          To make your collections available in the marketplace, please publish
          them by visiting
          <nuxt-link to="/artisan/collection">Collections</nuxt-link>. This will
          make them visible to potential buyers/sellers.
        </a-typography-paragraph>
      </a-typography>

      <a-row :gutter="[16, 16]" type="flex">
        <a-col :xs="24" :md="6">
          <marketplace-filter />
        </a-col>
        <a-col :xs="24" :md="18">
          <marketplace-listing />
        </a-col>
      </a-row>
    </a-page-header>
  </div>
</template>

<script setup>
useSeoMeta({
  title: 'Marketplace',
  description: 'Unlock potential buyers/sellers for your artisan keycaps!',
})
</script>
