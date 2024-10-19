<template>
  <div class="flex flex-col gap-6">
    <div class="flex flex-col gap-2">
      <label for="colorway_name">Name</label>
      <InputText id="colorway_name" v-model.trim="colorway.name" type="text" />
    </div>
    <div class="grid grid-cols-4 gap-2">
      <div class="col-span-2 flex flex-col gap-2">
        <label for="colorway_release">Release</label>
        <InputText
          id="colorway_release"
          v-model.trim="colorway.release"
          type="text"
        />
      </div>
      <div class="col-span-1 flex flex-col gap-2">
        <label for="colorway_qty">Quantity</label>
        <InputText id="colorway_qty" v-model="colorway.qty" v-keyfilter.num />
      </div>
      <div class="col-span-1 flex flex-col gap-2">
        <label for="colorway_order">Order</label>
        <InputText
          id="colorway_order"
          v-model="colorway.order"
          v-keyfilter.num
        />
      </div>
    </div>
    <div class="grid grid-cols-2 gap-2">
      <div class="flex items-center gap-2">
        <Checkbox v-model="colorway.giveaway" binary />
        <label for="colorway_giveaway">Giveaway</label>
      </div>
      <div class="flex items-center gap-2">
        <Checkbox v-model="colorway.commissioned" binary />
        <label for="colorway_commission">Commission</label>
      </div>
    </div>
    <div
      v-if="!colorway.giveaway && !colorway.commissioned"
      class="grid grid-cols-2 gap-2"
    >
      <div class="flex flex-col gap-2">
        <label for="colorway_price">Price</label>
        <InputText
          id="colorway_price"
          v-model="colorway.price"
          v-keyfilter.money
        />
      </div>
      <div class="flex flex-col gap-2">
        <label for="colorway_sale_type">Sale Type</label>
        <Select
          id="colorway_sale_type"
          v-model="colorway.sale_type"
          :options="['Raffle', 'FCFS', 'Fulfillment']"
        />
      </div>
    </div>
    <div class="flex flex-col gap-2">
      <label for="colorway_desc">Description</label>
      <Textarea
        id="colorway_desc"
        v-model.trim="colorway.description"
        :rows="5"
        auto-resize
      />
    </div>
    <div class="flex flex-col gap-2">
      <label for="colorway_story">Image</label>
      <FileUpload name="demo[]" :multiple="false" accept="image/*" disabled>
        <template #empty>
          <span>Drop files here to upload or click to select.</span>
        </template>
      </FileUpload>
    </div>
    <div class="flex flex-col gap-2">
      <Button label="Save" @click="addColorway" />
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

// const currencies = ['USD', 'EUR', 'CAD', 'SGD', 'MYR', 'CNY', 'VND']

const route = useRoute()
const colorway = ref({
  name: '',
  img: '',
})

// const formRules = ref({
//   name: [{ required: true, type: 'string', trigger: ['change', 'blur'] }],
//   release: [{ type: 'string', trigger: ['change', 'blur'] }],
//   qty: [{ type: 'number', trigger: ['change', 'blur'] }],
//   order: [{ required: true, type: 'number', trigger: ['change', 'blur'] }],
//   currency: [{ type: 'enum', enum: currencies, trigger: ['change', 'blur'] }],
//   price: [{ type: 'number', trigger: ['change', 'blur'] }],
//   sale_type: [
//     {
//       type: 'enum',
//       enum: ['Raffle', 'FCFS', 'Fulfillment'],
//       trigger: ['change', 'blur'],
//     },
//   ],
//   description: [{ type: 'string', trigger: ['change', 'blur'] }],
//   img: [{ required: true, type: 'url' }],
// })

onBeforeMount(() => {
  Object.assign(colorway.value, metadata)
})

const addColorway = async () => {
  $fetch(
    `/api/makers/${route.params.maker}/sculpts/${route.params.sculpt}/colorways`,
    {
      method: 'post',
      body: colorway.value,
    },
  )
    .then(() => {
      message.success('Colorway updated successfully!')
    })
    .catch((error) => {
      console.error(error)
      message.error(error.message)
    })
}

// const fetching = ref(false)
// const keycaps = ref([])
// const fetchkeycaps = (val) => {
//   fetching.value = true
//   $fetch(`/api/keycaps?query=${val}`)
//     .then((data) => {
//       keycaps.value = data.map((k) => ({ key: k.id, value: k.name }))
//       fetching.value = false
//     })
//     .catch(() => {
//       fetching.value = false
//     })
// }
</script>
