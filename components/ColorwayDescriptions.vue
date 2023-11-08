<template>
  <a-descriptions
    :title="isMeta ? colorwayTitle(colorway) : 'Information'"
    :column="1"
    size="small"
  >
    <template v-if="isMeta" #extra>
      <a-tag v-if="colorway.giveaway" color="goldenrod">
        <template #icon> <gift-filled /> Giveaway </template>
      </a-tag>

      <a-tag v-if="colorway.commissioned" color="palevioletred">
        <template #icon> <bg-colors-outlined /> Commissioned </template>
      </a-tag>
    </template>

    <a-descriptions-item v-if="colorway.release" label="Released">
      {{ colorway.release }}
    </a-descriptions-item>
    <a-descriptions-item v-if="colorway.qty" label="Quantity">
      {{ colorway.qty }}
    </a-descriptions-item>
    <a-descriptions-item v-if="colorway.price" label="Price">
      {{ colorway.currency }} {{ colorway.price }}
    </a-descriptions-item>
    <a-descriptions-item v-if="colorway.sale_type" label="Sale Type">
      {{ colorway.sale_type }}
    </a-descriptions-item>
  </a-descriptions>

  <a-typography-paragraph v-for="(line, idx) in descriptionLines" :key="idx">
    {{ line }}
  </a-typography-paragraph>
</template>

<script setup>
const { colorway } = defineProps({
  colorway: {
    type: Object,
    default() {
      return {}
    },
  },
})

const { isMobile } = useDevice()
const isMeta = computed(() => {
  return isMobile || !colorway.description
})

const descriptionLines = computed(() => {
  return colorway.description ? colorway.description.split('\n') : []
})
</script>
