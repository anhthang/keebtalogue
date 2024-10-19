<template>
  <div class="flex flex-col gap-6">
    <div class="flex flex-col gap-2">
      <label for="sale_name">Sculpt</label>
      <Select
        id="sale_name"
        v-model="sale.sculpt_id"
        option-label="label"
        option-value="value"
        :options="
          Object.entries(metadata).map(([value, label]) => ({ label, value }))
        "
      />
    </div>
    <div class="flex flex-col gap-2">
      <label for="sale_title">Title</label>
      <InputText id="sale_title" v-model.trim="sale.title" type="text" />
    </div>
    <div class="flex flex-col gap-2">
      <label for="sale_title">Date</label>
      <DatePicker
        v-model="sale.date"
        inline
        show-button-bar
        :min-date="new Date()"
        class="w-full"
      />
    </div>
    <div class="flex flex-col gap-2">
      <Button label="Save" @click="addSale" />
    </div>
  </div>
</template>

<script setup>
const { metadata } = defineProps({
  metadata: {
    type: Object,
    default: () => ({}),
  },
})

const route = useRoute()
const sale = ref({
  maker_id: route.params.maker,
})

watch(
  () => sale.value.sculpt_id,
  () => {
    sale.value.sculpt_name = metadata[sale.value.sculpt_id]
  },
)

const addSale = () => {
  const body = {
    ...sale.value,
    date: sale.value.date.slice(0, 10),
  }

  $fetch('/api/sales', {
    method: 'post',
    body,
  })
    .then(() => {
      message.success('New sale added successfully!')
    })
    .catch((error) => {
      message.error(error.message)
    })
}
</script>
