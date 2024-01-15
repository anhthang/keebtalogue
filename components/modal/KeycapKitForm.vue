<template>
  <a-form :ref="formRef" :rules="formRules" :model="kit" layout="vertical">
    <a-form-item
      ref="name"
      name="name"
      v-bind="validateInfos.name"
      label="Name"
    >
      <a-auto-complete
        v-model:value="kit.name"
        :options="suggestionKits.map((value) => ({ value }))"
        @change="onSearchKit"
      />
    </a-form-item>

    <a-form-item ref="img" name="img" v-bind="validateInfos.img" label="Image">
      <a-input v-model:value="kit.img">
        <template #prefix><link-outlined /></template>
      </a-input>
    </a-form-item>

    <a-row :gutter="[8, 8]">
      <a-col :xs="12">
        <a-form-item
          ref="price"
          name="price"
          v-bind="validateInfos.price"
          label="Price"
        >
          <a-input-number v-model:value="kit.price">
            <template #prefix><number-outlined /></template>
          </a-input-number>
        </a-form-item>
      </a-col>
      <a-col :xs="12">
        <a-form-item
          ref="qty"
          name="qty"
          v-bind="validateInfos.qty"
          label="Quantity"
        >
          <a-input-number v-model:value="kit.qty">
            <template #prefix><number-outlined /></template>
          </a-input-number>
        </a-form-item>
      </a-col>
    </a-row>

    <a-form-item
      ref="description"
      name="description"
      v-bind="validateInfos.description"
      label="Description"
    >
      <a-textarea v-model:value="kit.description" auto-size />
    </a-form-item>

    <a-form-item>
      <a-checkbox v-model:checked="kit.cancelled">Cancelled</a-checkbox>
    </a-form-item>
  </a-form>
</template>

<script setup>
import { Form } from 'ant-design-vue'

const { metadata, isEdit } = defineProps({
  metadata: {
    type: Object,
    default() {
      return {}
    },
  },
  isEdit: Boolean,
})

const predefinedKits = [
  'Base',
  'Novelties',
  'Spacebars',
  'Alphas',
  'Modifiers',
  '40s',
  'Numpad',
  'Extension',
  'Addons',
  'Accents',
  'Hiragana',
  'Katakana',
  'Hangul',
  'Cyrillic',
  'NorDe',
  'NorDeUK',
  'Forties',
  'ISO',
  'Colevrak',
  '40s/Ortho',
  'International',
]

const suggestionKits = ref(predefinedKits)

const onSearchKit = (text) => {
  suggestionKits.value = predefinedKits.filter((k) =>
    k.toLowerCase().includes(text.toLowerCase()),
  )
}

const route = useRoute()
const kit = ref({
  name: '',
  img: '',
  profile_keycap_id: `${route.params.profile}/${route.params.keycap}`,
})

onBeforeMount(() => {
  Object.assign(kit.value, metadata)
})

const formRef = ref()
const formRules = ref({
  name: [{ required: true, type: 'string', trigger: ['change', 'blur'] }],
  qty: [{ required: false, type: 'number', trigger: ['change', 'blur'] }],
  price: [{ required: false, type: 'number', trigger: ['change', 'blur'] }],
  img: [{ required: true, type: 'url', trigger: ['change', 'blur'] }],
  description: [{ type: 'string', trigger: ['change', 'blur'] }],
})

const { useForm } = Form
const { validate, validateInfos } = useForm(kit, formRules)

const addKit = async () => {
  await validate()
    .then(() => {
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
    })
    .catch(() => {
      // ignore
    })
}

defineExpose({
  addKit,
})
</script>
