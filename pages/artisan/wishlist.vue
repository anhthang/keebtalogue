<template>
  <a-page-header v-if="$device.isDesktop" title="Wishlist" class="container">
    <a-row :gutter="[16, 16]" type="flex">
      <a-alert class="alert-banner" banner>
        <template #message>
          <a-typography-text strong> Attention: </a-typography-text>
          We're phasing out this feature. Check out the
          <nuxt-link to="/artisan/marketplace"> Marketplace </nuxt-link> for
          powerful alternatives!
        </template>
      </a-alert>
    </a-row>

    <a-row :gutter="[16, 16]" type="flex">
      <a-col :xs="24">
        <wishlist-settings />
      </a-col>
      <a-col :xs="24">
        <wishlist-preview />
      </a-col>
    </a-row>
  </a-page-header>
  <a-page-header v-else class="container">
    <a-result
      status="404"
      title="This feature is currently unavailable on mobile devices."
      sub-title="Please use your desktop for full access. Or check out the Marketplace for powerful alternatives!"
    >
      <template #extra>
        <nuxt-link to="/artisan/marketplace">
          <a-button type="primary"><shop-outlined /> Marketplace</a-button>
        </nuxt-link>
      </template>
    </a-result>
  </a-page-header>
</template>

<script setup>
useSeoMeta({
  title: 'Wishlist',
  description: 'Create eye-catching wishlist images for seamless trading!',
})
</script>
