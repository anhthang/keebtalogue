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

    <a-form-item ref="img" name="img" v-bind="validateInfos.img" label="Image">
      <a-input v-model:value="kit.img">
        <template #prefix><link-outlined /></template>
      </a-input>
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

const route = useRoute()
const kit = ref({
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
