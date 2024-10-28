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
      <Button label="Save" @click="onSubmit" />
    </div>

    <Toast />
  </div>
</template>

<script setup>
const emit = defineEmits(['onSuccess'])

const { metadata } = defineProps({
  metadata: {
    type: Object,
    default: () => ({}),
  },
})

const route = useRoute()
const toast = useToast()

const sale = ref({
  maker_id: route.params.maker,
})

watch(
  () => sale.value.sculpt_id,
  () => {
    sale.value.sculpt_name = metadata[sale.value.sculpt_id]
  },
)

const onSubmit = () => {
  const body = {
    ...sale.value,
    date: toISODate(sale.value.date),
  }

  $fetch('/api/sales', {
    method: 'post',
    body,
  })
    .then(() => {
      toast.add({
        severity: 'success',
        summary: 'New sale added successfully!',
        life: 3000,
      })
      emit('onSuccess')
    })
    .catch((error) => {
      toast.add({ severity: 'error', summary: error.message, life: 3000 })
    })
}
</script>
