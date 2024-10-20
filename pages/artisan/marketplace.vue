<template>
  <Panel class="container" pt:root:class="!border-0 !bg-transparent">
    <template #header>
      <div class="flex items-center gap-4 font-medium text-3xl">
        Marketplace
      </div>
    </template>

    <Message class="w-fit mx-auto mb-4" severity="info">
      To make your collections available in the marketplace, please publish them
      by visiting
      <nuxt-link to="/artisan/collection">Collections</nuxt-link>. This will
      make them visible to potential buyers/sellers.
    </Message>

    <div class="grid grid-cols-4 gap-4">
      <div class="col-span-4 md:col-span-1 flex flex-col gap-2">
        <marketplace-filter />
      </div>
      <div class="col-span-4 md:col-span-3 flex flex-col gap-2">
        <marketplace-listing />
      </div>
    </div>
  </Panel>
</template>

<script setup>
useSeoMeta({
  title: 'Marketplace',
  description: 'Unlock potential buyers/sellers for your artisan keycaps!',
})
</script>
