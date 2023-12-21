<template>
  <a-form :ref="formRef" :rules="formRules" :model="kit" layout="vertical">
    <a-form-item
      ref="name"
      name="name"
      v-bind="validateInfos.name"
      label="Name"
    >
      <a-input v-model:value="kit.name">
        <template #prefix><font-size-outlined /></template>
      </a-input>
    </a-form-item>

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

    <a-form-item ref="img" name="img" v-bind="validateInfos.img" label="Image">
      <a-input-number v-model:value="kit.img">
        <template #prefix><link-outlined /></template>
      </a-input-number>
    </a-form-item>
  </a-form>
</template>

<script setup>
import { Form } from 'ant-design-vue'

const { metadata } = defineProps({
  metadata: {
    type: Object,
    default() {
      return {}
    },
  },
})

const kit = ref({})
onBeforeMount(() => {
  console.log('metadata', metadata)
  Object.assign(kit.value, metadata)
})

const formRef = ref()
const formRules = ref({
  name: [{ required: true, type: 'string', trigger: ['change', 'blur'] }],
  qty: [{ type: 'number', trigger: ['change', 'blur'] }],
  price: [{ required: true, type: 'number', trigger: ['change', 'blur'] }],
  img: [{ required: true, type: 'url', trigger: ['change', 'blur'] }],
})

const { useForm } = Form
const { validate, validateInfos } = useForm(kit, formRules)

const addKit = () => {
  validate()
    .then(() => {
      $fetch(`/api/keycaps/${kit.value.profile_keycap_id}/kits`, {
        method: 'post',
        body: kit.value,
      })
        .then(() => {
          message.success('Kaycap kit updated successfully!')
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
