<template>
  <div class="container">
    <a-page-header title="Marketplace">
      <template #extra>
        <nuxt-link to="/artisan/wishlist">
          <a-button type="primary">
            <file-image-outlined /> Create Wishlist
          </a-button>
        </nuxt-link>
      </template>

      <a-row :gutter="[8, 8]" type="flex">
        <a-alert class="collection-alert" type="info" banner>
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

      <a-row :gutter="[8, 8]">
        <a-col :xs="24" :md="12">
          <a-card>
            <a-typography-title :level="5">
              <shopping-cart-outlined /> Buying
            </a-typography-title>
            <marketplace-listing :data="data.filter((c) => c.type === 'buy')" />
          </a-card>
        </a-col>

        <a-col :xs="24" :md="12">
          <a-card>
            <a-typography-title :level="5">
              <shop-outlined /> Selling
            </a-typography-title>
            <marketplace-listing
              :data="data.filter((c) => c.type === 'sell')"
            />
          </a-card>
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

const { data } = await useAsyncData(() => $fetch('/api/marketplace'))
</script>
