<template>
  <nuxt-link :to="`/artisan/maker/${maker.id}`">
    <Card
      class="h-full"
      pt:header:class="flex items-center mx-auto p-6 h-44 md:h-60"
      pt:body:class="items-center"
    >
      <template #header>
        <NuxtImg
          :class="{
            invert: maker.invertible_logo && $colorMode.value === 'dark',
          }"
          loading="lazy"
          :alt="maker.name"
          :src="`/logo/${maker.id}.png`"
          width="100%"
        />
      </template>
      <template #title>{{ maker.name }}</template>
    </Card>
  </nuxt-link>
</template>

<script setup>
defineProps({
  maker: {
    type: Object,
    default: () => ({}),
  },
})
</script>
