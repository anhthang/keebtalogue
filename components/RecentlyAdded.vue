<template>
  <Fieldset legend="Recently Added Artisans" pt:legend:class="w-auto">
    <nuxt-link
      v-for="maker in makers"
      :key="maker.url"
      :to="`/artisan/maker/${maker.id}`"
    >
      <div class="flex items-center">
        <Avatar
          :image="`/logo/${maker.id}.png`"
          :class="
            maker.invertible_logo && $colorMode.value === 'dark'
              ? 'invertible-logo'
              : ''
          "
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

<style>
.ant-avatar img {
  object-fit: contain;
}

.invertible-logo {
  filter: invert();
}
</style>
