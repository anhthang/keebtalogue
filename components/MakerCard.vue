<template>
  <nuxt-link :to="`/artisan/maker/${maker.id}`">
    <Card
      class="flex items-center flex-1 h-full"
      pt:header:class="flex items-center mx-5 h-44 md:h-60"
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
const { maker } = defineProps({
  maker: {
    type: Object,
    default: () => ({}),
  },
})
</script>
