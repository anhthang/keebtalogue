<template>
  <a-form :ref="formRef" :rules="formRules" :model="colorway" layout="vertical">
    <a-form-item
      ref="name"
      name="name"
      label="Name"
      v-bind="validateInfos.name"
    >
      <a-input v-model:value="collection.name" />
    </a-form-item>

    <a-form-item label="Collection Type">
      <template v-if="collection.publised" #extra>
        <a-typography-text type="danger">
          Anyone can now discover the treasures you've assembled in this public
          collection.
        </a-typography-text>
      </template>
      <template v-else #extra>
        Choosing private keeps this collection under lock and key, hidden from
        prying eyes.
      </template>
      <a-radio-group v-model:value="collection.publised">
        <a-radio :value="false">Private</a-radio>
        <a-radio :value="true">Public</a-radio>
      </a-radio-group>
    </a-form-item>

    <!-- <a-form-item v-if="collection.publised">
      <a-radio-group v-model:value="collection.type">
        <a-radio value="buy">Buying</a-radio>
        <a-radio value="sell">Selling</a-radio>
      </a-radio-group>
    </a-form-item> -->
  </a-form>
</template>

<script setup>
import { Form } from 'ant-design-vue'

const { metadata, uid } = defineProps({
  metadata: {
    type: Object,
    default() {
      return {}
    },
  },
  // eslint-disable-next-line vue/require-default-prop
  uid: String,
})

const collection = ref({
  name: '',
  publised: false,
})

onBeforeMount(() => {
  Object.assign(collection.value, metadata)
})

const formRef = ref()
const formRules = ref({
  name: [{ required: true, type: 'string', trigger: ['change', 'blur'] }],
})

const { useForm } = Form
const { validate, validateInfos } = useForm(collection, formRules)

const addCollection = async () => {
  await validate()
    .then(async () => {
      const { name } = collection.value

      await $fetch(`/api/users/${uid}/collections`, {
        method: 'post',
        body: {
          name,
          uid,
        },
      })
        .then(() => {
          message.success(`Collection [${name}] added successfully!`)
        })
        .catch((error) => {
          message.error(error.message)
        })
    })
    .catch(() => {
      // ignore
    })
}

defineExpose({
  addCollection,
})
</script>
