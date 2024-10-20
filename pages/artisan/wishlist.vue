<template>
  <Panel
    v-if="$device.isDesktop"
    class="container"
    pt:root:class="!border-0 !bg-transparent"
  >
    <template #header>
      <div class="flex items-center gap-4 font-medium text-3xl">Wishlist</div>
    </template>

    <Message class="w-fit mx-auto mb-4" severity="warn">
      <strong>Attention:</strong> We're phasing out this feature. Check out the
      <nuxt-link to="/artisan/marketplace"> Marketplace </nuxt-link> for
      powerful alternatives!
    </Message>

    <div class="flex flex-col gap-4">
      <wishlist-settings />
      <wishlist-preview />
    </div>
  </Panel>
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
