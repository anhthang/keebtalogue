<template>
  <div class="container">
    <a-page-header title="Marketplace">
      <!-- <template #subTitle>
        <a-tag color="orange">Experiment</a-tag>
      </template> -->
      <template v-if="$device.isDesktop" #extra>
        <nuxt-link to="/artisan/wishlist">
          <a-button type="primary">
            <file-image-outlined /> Create Wishlist
          </a-button>
        </nuxt-link>
      </template>

      <a-row :gutter="[8, 8]" type="flex">
        <a-alert class="alert-banner" type="info" banner>
          <template #message>
            <a-typography-text strong> Early Access: </a-typography-text>
            This feature is still under development, so you may experience bugs
            or incomplete functionality.
          </template>
        </a-alert>
      </a-row>

      <a-typography>
        <a-typography-paragraph>
          To make your collections available in the marketplace, please publish
          them by visiting 'Manage Collections'. This will make them visible to
          potential buyers/sellers.
        </a-typography-paragraph>
      </a-typography>

      <a-row :gutter="[8, 8]" type="flex">
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
