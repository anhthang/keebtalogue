<template>
  <Fieldset legend="Recently Added Artisans" pt:legend:class="w-auto">
    <DataView :value="makers">
      <template #list="slotProps">
        <div
          v-for="(maker, index) in slotProps.items"
          :key="index"
          :class="{
            'border-t border-zinc-100 dark:border-zinc-700': index !== 0,
          }"
        >
          <nuxt-link :to="`/artisan/maker/${maker.id}`">
            <div class="flex items-center">
              <Avatar
                :image="`/logo/${maker.id}.png`"
                :class="{
                  invert: maker.invertible_logo && $colorMode.value === 'dark',
                }"
                size="large"
                pt:image:class="object-contain"
              />
              <Card class="!shadow-none">
                <template #title>{{ maker.name }}</template>
                <template #content>
                  {{
                    maker.additions === 1
                      ? '1 addition'
                      : `${maker.additions} additions`
                  }}
                </template>
              </Card>
            </div>
          </nuxt-link>
        </div>
      </template>
    </DataView>
  </Fieldset>
</template>

<script setup>
const { makers } = defineProps({
  makers: {
    type: Object,
    default: () => ({}),
  },
})
</script>
