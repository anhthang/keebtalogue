<template>
  <a-descriptions title="Information" :column="1">
    <template #extra>
      <a-tag v-if="colorway.giveaway" color="orange">
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
const { metadata } = defineProps({
  metadata: {
    type: Object,
    default() {
      return {}
    },
  },
})

const colorway = ref({})

onBeforeMount(() => {
  if (metadata && Object.keys(metadata).length) {
    colorway.value = { ...metadata }
  }
})

const descriptionLines = computed(() => {
  return colorway.value.description
    ? colorway.value.description.split('\n')
    : []
})
</script>
