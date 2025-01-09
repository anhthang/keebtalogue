<template>
  <nuxt-link :to="`/artisan/maker/${sculpt.maker_id}/${sculpt.sculpt_id}`">
    <Card
      class="h-full overflow-hidden"
      :pt="{
        header: 'w-full h-44 md:h-60',
        caption: 'flex items-center',
        title: 'w-40 text-center truncate',
      }"
    >
      <template #header>
        <img
          loading="lazy"
          :alt="sculpt.name"
          :src="sculpt.img"
          class="w-full h-full object-cover"
        />
      </template>
      <template #title>{{ sculpt.name }}</template>
      <template #subtitle>{{ sculpt.total_colorways }} colorways</template>
    </Card>
  </nuxt-link>
</template>

<script setup>
defineProps({
  sculpt: {
    type: Object,
    default: () => ({}),
  },
  favorite: Boolean,
})
</script>
