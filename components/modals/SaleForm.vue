<template>
  <a-form layout="vertical">
    <a-form-item label="Sculpt">
      <a-select
        v-model:value="sale.sculpt_id"
        show-search
        @change="selectSculpt"
      >
        <a-select-option
          v-for="(name, sculptId) in metadata"
          :key="sculptId"
          :value="sculptId"
        >
          {{ name }}
        </a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item label="Title/Colorway">
      <a-input v-model:value="sale.title" />
    </a-form-item>
    <a-form-item label="Sale Date">
      <a-calendar v-model:value="sale.date" :fullscreen="false" />
    </a-form-item>
  </a-form>
</template>

<script setup>
import { message } from 'ant-design-vue'

const { metadata } = defineProps({
  metadata: {
    type: Object,
    default() {
      return {}
    },
  },
})

const route = useRoute()
const sale = ref({
  maker_id: route.params.maker,
})

const selectSculpt = (e) => {
  sale.value.sculpt_name = metadata[e]
}

const addSale = () => {
  const body = {
    ...sale.value,
    date: sale.value.date.format('YYYY-MM-DD'),
  }

  $fetch('/api/sales', {
    method: 'post',
    body,
  })
    .then(() => {
      message.success('Sale added succesfully.')
    })
    .catch((error) => {
      message.error(error.message)
    })
}

defineExpose({
  addSale,
})
</script>
