<template>
  <Panel
    header="Wishlist"
    pt:root:class="!border-0 !bg-transparent"
    pt:title:class="flex items-center gap-4 font-medium text-3xl"
  >
    <!-- <Message
      class="w-fit mx-auto mb-4"
      severity="warn"
      icon="pi pi-exclamation-triangle"
    >
      <strong>Attention:</strong> We're phasing out this feature. Check out the
      <nuxt-link to="/artisan/marketplace"> Marketplace </nuxt-link> for
      powerful alternatives!
    </Message> -->

    <div v-if="$device.isDesktop" class="flex flex-col gap-4">
      <WishlistSettings />
      <WishlistPreview />
    </div>
    <div v-else class="flex flex-col items-center text-center gap-8">
      <img class="w-2/3" :src="`/svg/access_denied.svg`" alt="Access Denied" />

      <Message variant="simple" size="large">
        This feature isn't available on mobile.
      </Message>
      <Message variant="simple" severity="secondary">
        Please use a tablet or desktop for full access, or explore our
        Marketplace for powerful alternatives.
      </Message>

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
