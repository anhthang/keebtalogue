<template>
  <div
    class="bg-zinc-100 dark:bg-zinc-900 w-full h-screen p-6 hidden lg:flex items-start gap-6 overflow-hidden"
  >
    <SpeedInsights />
    <LayoutSider />
    <div class="flex-1 h-full overflow-y-auto pb-0.5">
      <NuxtPage />
    </div>
  </div>
</template>

<script setup>
import { SpeedInsights } from '@vercel/speed-insights/nuxt'
</script>
