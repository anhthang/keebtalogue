<template>
  <div class="flex flex-col gap-6">
    <div class="flex flex-col gap-2">
      <label for="kit_name">Name</label>
      <InputText id="kit_name" v-model.trim="kit.name" type="text" />
    </div>
    <div class="flex flex-col gap-2">
      <label for="kit_img">Image</label>
      <InputText id="kit_img" v-model.trim="kit.img" type="url" />
    </div>
    <div class="grid grid-cols-2 gap-2">
      <div class="flex flex-col gap-2">
        <label for="kit_price">Price</label>
        <InputText id="kit_price" v-model="kit.price" v-keyfilter.money />
      </div>
      <div class="flex flex-col gap-2">
        <label for="kit_qty">Quantity</label>
        <InputText id="kit_qty" v-model="kit.qty" v-keyfilter.num />
      </div>
    </div>
    <div class="flex flex-col gap-2">
      <label for="kit_description">Description</label>
      <Textarea
        id="kit_description"
        v-model.trim="kit.description"
        :rows="5"
        auto-resize
      />
    </div>
    <div class="flex items-center gap-2">
      <Checkbox id="kit_cancelled" v-model="kit.cancelled" binary />
      <label for="kit_cancelled">Cancelled</label>
    </div>
    <div class="flex flex-col gap-2">
      <Button label="Save" @click="addKit" />
    </div>
  </div>
</template>

<script setup>
const { metadata, isEdit } = defineProps({
  metadata: {
    type: Object,
    default: () => ({}),
  },
  isEdit: Boolean,
})

// const predefinedKits = [
//   'Base',
//   'Novelties',
//   'Spacebars',
//   'Alphas',
//   'Modifiers',
//   '40s',
//   'Numpad',
//   'Extension',
//   'Addons',
//   'Accents',
//   'Hiragana',
//   'Katakana',
//   'Hangul',
//   'Cyrillic',
//   'NorDe',
//   'NorDeUK',
//   'Forties',
//   'ISO',
//   'Colevrak',
//   '40s/Ortho',
//   'International',
// ]

const route = useRoute()
const kit = ref({
  name: '',
  img: '',
  profile_keycap_id: `${route.params.profile}/${route.params.keycap}`,
})

onBeforeMount(() => {
  Object.assign(kit.value, metadata)
})

// const formRules = ref({
//   name: [{ required: true, type: 'string', trigger: ['change', 'blur'] }],
//   qty: [{ required: false, type: 'number', trigger: ['change', 'blur'] }],
//   price: [{ required: false, type: 'number', trigger: ['change', 'blur'] }],
//   img: [{ required: true, type: 'url', trigger: ['change', 'blur'] }],
//   description: [{ type: 'string', trigger: ['change', 'blur'] }],
// })

const addKit = () => {
  $fetch(`/api/keycaps/${kit.value.profile_keycap_id}/kits`, {
    method: 'post',
    body: kit.value,
  })
    .then(() => {
      if (isEdit) {
        message.success(`[${kit.value.name}] kit updated successfully!`)
      } else {
        message.success(`[${kit.value.name}] kit added successfully!`)
      }
    })
    .catch((error) => {
      console.error(error)
      message.error(error.message)
    })
}
</script>
