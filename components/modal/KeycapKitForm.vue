<template>
  <Form
    v-slot="$form"
    :initial-values="kit"
    :resolver
    class="flex flex-col gap-6"
    @submit="onSubmit"
  >
    <div class="flex flex-col gap-2">
      <label for="kit_name">Name</label>
      <IconField>
        <InputIcon class="pi pi-pencil" />
        <InputText
          id="kit_name"
          v-model.trim="kit.name"
          name="name"
          type="text"
          fluid
        />
      </IconField>
      <Message
        v-if="$form.name?.invalid"
        severity="error"
        size="small"
        variant="simple"
      >
        {{ $form.name.error.message }}
      </Message>
    </div>
    <div class="flex flex-col gap-2">
      <label for="kit_img">Image</label>
      <IconField>
        <InputIcon class="pi pi-image" />
        <InputText
          id="kit_img"
          v-model.trim="kit.img"
          name="img"
          type="url"
          fluid
        />
      </IconField>
      <Message
        v-if="$form.img?.invalid"
        severity="error"
        size="small"
        variant="simple"
      >
        {{ $form.img.error.message }}
      </Message>
    </div>
    <div class="grid grid-cols-2 gap-2">
      <div class="flex flex-col gap-2">
        <label for="kit_price">Price</label>
        <IconField>
          <InputIcon class="pi pi-tag" />
          <InputNumber
            v-model="kit.price"
            v-keyfilter.money
            input-id="kit_price"
            name="price"
            :use-grouping="false"
            fluid
          />
        </IconField>
        <Message
          v-if="$form.price?.invalid"
          severity="error"
          size="small"
          variant="simple"
        >
          {{ $form.price.error.message }}
        </Message>
      </div>
      <div class="flex flex-col gap-2">
        <label for="kit_qty">Quantity</label>
        <IconField>
          <InputIcon class="pi pi-hashtag" />
          <InputNumber
            v-model.number="kit.qty"
            input-id="kit_qty"
            name="qty"
            :use-grouping="false"
            fluid
          />
        </IconField>
        <Message
          v-if="$form.qty?.invalid"
          severity="error"
          size="small"
          variant="simple"
        >
          {{ $form.qty.error.message }}
        </Message>
      </div>
    </div>
    <div class="flex flex-col gap-2">
      <label for="kit_description">Description</label>
      <Textarea
        id="kit_description"
        v-model.trim="kit.description"
        name="description"
        :rows="5"
        auto-resize
      />
    </div>
    <div class="flex items-center gap-2">
      <Checkbox
        v-model="kit.cancelled"
        name="cancelled"
        input-id="kit_cancelled"
        binary
      />
      <label for="kit_cancelled">Cancelled</label>
    </div>
    <div class="flex flex-col gap-2">
      <Button label="Save" type="submit" :disabled="!$form.valid" />
    </div>

    <Toast />
  </Form>
</template>

<script setup>
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { z } from 'zod'

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
  cancelled: false,
})

onBeforeMount(() => {
  Object.assign(kit.value, metadata)
})

const resolver = ref(
  zodResolver(
    z.object({
      name: z.string().min(1),
      qty: z.number().nullish(),
      price: z.number().nullish(),
      img: z.string().url().nullish().or(z.string().min(0).max(0)),
      // description: z.string(),
      cancelled: z.boolean().catch(false),
    }),
  ),
)

const onSubmit = async ({ valid }) => {
  if (!valid) return

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
