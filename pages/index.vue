<template>
  <Panel
    header="Home"
    pt:root:class="!border-0 !bg-transparent"
    pt:title:class="flex items-center gap-4 font-medium text-3xl"
  >
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <ArtisanCollectorGuide
        class="col-span-4 md:col-span-3"
        :class="{
          'md:col-span-4': !data.makers.length && !data.keycaps.length,
        }"
      />

      <div class="col-span-4 md:col-span-1 flex flex-col gap-4">
        <LatestArtisans v-if="data.makers.length" :makers="data.makers" />
        <PreOrderKeycaps v-if="data.keycaps.length" :keycaps="data.keycaps" />
      </div>
    </div>
  </Panel>
</template>

<script setup>
const { data } = await useAsyncData(() => $fetch('/api/statistics'))
</script>

<style>
:root {
  font-family: Dosis, sans-serif;
  --p-card-body-padding: 1.125rem;
  --p-card-title-font-size: 1.125rem;
}
</style>
