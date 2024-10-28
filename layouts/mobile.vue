<template>
  <div class="flex flex-col gap-4">
    <SpeedInsights />
    <MegaMenu>
      <template #start>
        <nuxt-link to="/">
          <div class="flex items-center gap-3">
            <div
              class="w-12 h-12 border border-primary rounded-xl flex items-center justify-center"
            >
              <img
                :alt="$config.public.appName"
                :src="`/logo-filled.png`"
                class="w-8"
              />
            </div>
          </div>
        </nuxt-link>
      </template>

      <template #end>
        <MenuSettings :slim="true" />
      </template>
    </MegaMenu>

    <NuxtPage />
  </div>
</template>

<script setup>
import { SpeedInsights } from '@vercel/speed-insights/nuxt'
</script>
