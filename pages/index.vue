<template>
  <Panel
    header="Home"
    class="container"
    pt:root:class="!border-0 !bg-transparent"
    pt:header:class="flex items-center gap-4 font-medium text-3xl"
  >
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <artisan-collector-guide class="col-span-4 md:col-span-3" />
      <recently-added class="col-span-4 md:col-span-1" :makers="data.makers" />
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
  --p-card-body-padding: 1rem;
  --p-card-title-font-size: 1rem;
}

.container {
  margin: 0 auto;
  min-height: calc(100vh - 128px); /** minus header & footer */
  display: flex;
  flex-direction: column;
  max-width: 1600px;
}
</style>
