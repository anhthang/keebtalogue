<template>
  <div class="flex flex-col gap-6">
    <div class="flex flex-col gap-2">
      <label for="kit_name">Name</label>
      <IconField>
        <InputIcon class="pi pi-pencil" />
        <InputText id="kit_name" v-model.trim="kit.name" type="text" fluid />
      </IconField>
    </div>
    <div class="flex flex-col gap-2">
      <label for="kit_img">Image</label>
      <IconField>
        <InputIcon class="pi pi-image" />
        <InputText id="kit_img" v-model.trim="kit.img" type="url" fluid />
      </IconField>
    </div>
    <div class="grid grid-cols-2 gap-2">
      <div class="flex flex-col gap-2">
        <label for="kit_price">Price</label>
        <IconField>
          <InputIcon class="pi pi-tag" />
          <InputText
            id="kit_price"
            v-model="kit.price"
            v-keyfilter.money
            fluid
          />
        </IconField>
      </div>
      <div class="flex flex-col gap-2">
        <label for="kit_qty">Quantity</label>
        <IconField>
          <InputIcon class="pi pi-hashtag" />
          <InputText id="kit_qty" v-model="kit.qty" v-keyfilter.num fluid />
        </IconField>
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
      <Checkbox v-model="kit.cancelled" input-id="kit_cancelled" binary />
      <label for="kit_cancelled">Cancelled</label>
    </div>
    <div class="flex flex-col gap-2">
      <Button label="Save" @click="onSubmit" />
    </div>

    <Toast />
  </div>
</template>

<script setup>
const emit = defineEmits(['onSuccess'])

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
const toast = useToast()

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

const onSubmit = () => {
  $fetch(`/api/keycaps/${kit.value.profile_keycap_id}/kits`, {
    method: 'post',
    body: kit.value,
  })
    .then(() => {
      if (isEdit) {
        toast.add({
          severity: 'success',
          summary: `[${kit.value.name}] kit updated successfully!`,
          life: 3000,
        })
        emit('onSuccess', undefined, true)
      } else {
        toast.add({
          severity: 'success',
          summary: `[${kit.value.name}] kit added successfully!`,
          life: 3000,
        })
        emit('onSuccess', undefined, true)
      }
    })
    .catch((error) => {
      console.error(error)
      toast.add({ severity: 'error', summary: error.message, life: 3000 })
    })
}
</script>
