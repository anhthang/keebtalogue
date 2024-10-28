<template>
  <Panel
    v-if="$device.isDesktop"
    header="Wishlist"
    pt:root:class="!border-0 !bg-transparent"
    pt:title:class="flex items-center gap-4 font-medium text-3xl"
  >
    <Message
      class="w-fit mx-auto mb-4"
      severity="warn"
      icon="pi pi-exclamation-triangle"
    >
      <strong>Attention:</strong> We're phasing out this feature. Check out the
      <nuxt-link to="/artisan/marketplace"> Marketplace </nuxt-link> for
      powerful alternatives!
    </Message>

    <div class="flex flex-col gap-4">
      <WishlistSettings />
      <WishlistPreview />
    </div>
  </Panel>
  <Panel v-else pt:root:class="!border-0 !bg-transparent">
    <div class="flex flex-col items-center gap-8">
      <div class="text-2xl">
        This feature is currently unavailable on mobile devices.
      </div>
      <div class="font-medium text-surface-500 dark:text-surface-300 mb-4">
        Please use your desktop for full access. Or check out the Marketplace
        for powerful alternatives!
      </div>

      <nuxt-link to="/artisan/marketplace">
        <Button label="Marketplace" icon="pi pi-shop" />
      </nuxt-link>
    </div>
  </Panel>
</template>

<script setup>
useSeoMeta({
  title: 'Wishlist',
  description: 'Create eye-catching wishlist images for seamless trading!',
})
</script>
