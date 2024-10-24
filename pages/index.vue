<template>
  <Panel
    header="Home"
    class="container"
    pt:root:class="!border-0 !bg-transparent"
    pt:title:class="flex items-center gap-4 font-medium text-3xl"
  >
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <ArtisanCollectorGuide class="col-span-4 md:col-span-3" />

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
  --color-text-gradient-stop-1: #4285f4;
  --color-text-gradient-stop-2: #9b72cb;
  --color-text-gradient-stop-3: #d96570;
  --color-surface: #fff;
  font-family: Dosis, sans-serif;
  --p-card-body-padding: 1.125rem;
  --p-card-title-font-size: 1.125rem;
}

.container {
  margin: 0 auto;
  min-height: calc(100vh - 128px); /** minus header & footer */
  display: flex;
  flex-direction: column;
  max-width: 1600px;
}
</style>
