<template>
  <Panel
    :header="`Welcome to ${$config.public.appName}`"
    pt:root:class="!border-0 !bg-transparent"
    pt:title:class="flex items-center gap-4 font-medium text-3xl"
  >
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div
        class="col-span-4 md:col-span-3 flex flex-col gap-4"
        :class="{
          'md:col-span-4': !data.makers.length && !data.keycaps.length,
          'order-last': $device.isMobile,
        }"
      >
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Fieldset pt:legend:class="w-auto">
            <template #legend>
              <div class="flex items-center gap-2">
                <span class="pi pi-search" />
                <span class="font-semibold"> Discover Your Next Gem </span>
              </div>
            </template>
            Explore a vast library of artisan keycaps and keycap sets.
          </Fieldset>
          <Fieldset pt:legend:class="w-auto">
            <template #legend>
              <div class="flex items-center gap-2">
                <span class="pi pi-list-check" />
                <span class="font-semibold"> Organize Your Collection </span>
              </div>
            </template>
            Effortlessly manage your entire collection – from individual artisan
            keycaps to complete keycap sets.
          </Fieldset>
        </div>

        <ArtisanCollectorGuide />
      </div>

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
