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

    <a-divider />

    <a-form-item label="Collection Type">
      <template #extra>
        <a-typography-text v-if="collection.published" type="danger">
          Anyone can now discover the treasures you've assembled in this public
          collection.
        </a-typography-text>
        <a-typography-text v-else type="secondary">
          Choosing private keeps this collection under lock and key, hidden from
          prying eyes.
        </a-typography-text>
      </template>
      <a-radio-group v-model:value="collection.published">
        <a-radio :value="false">Private</a-radio>
        <a-radio :value="true">Public</a-radio>
      </a-radio-group>
    </a-form-item>

    <a-form-item v-if="collection.published">
      <a-radio-group v-model:value="collection.type" disabled>
        <a-radio value="share">Sharing Only</a-radio>
        <a-radio value="buy">Buying</a-radio>
        <a-radio value="sell">Selling</a-radio>
      </a-radio-group>
      <template #extra>
        <a-typography-text v-if="collection.type === 'share'" type="secondary">
          Not listed in the marketplace, just for your eyes (and your friends')
          with link.
        </a-typography-text>
        <a-typography-text v-if="collection.type === 'buy'" type="secondary">
          On the hunt! Any leads appreciated!
        </a-typography-text>
        <a-typography-text v-if="collection.type === 'sell'" type="secondary">
          Up for grabs!
        </a-typography-text>
      </template>
    </a-form-item>
  </a-form>
</template>

<script setup>
import { Form } from 'ant-design-vue'

const { metadata, uid, isEdit } = defineProps({
  metadata: {
    type: Object,
    default() {
      return {}
    },
  },
  isEdit: Boolean,
  // eslint-disable-next-line vue/require-default-prop
  uid: String,
})

const collection = ref({
  name: '',
  published: false,
  type: 'share',
  uid,
})

onBeforeMount(() => {
  Object.assign(collection.value, metadata)
})

const formRef = ref()
const formRules = ref({
  name: [{ required: true, type: 'string', trigger: ['change', 'blur'] }],
  type: [
    {
      required: true,
      type: 'enum',
      enum: ['share', 'buy', 'sell'],
      trigger: ['change', 'blur'],
    },
  ],
})

const { useForm } = Form
const { validate, validateInfos } = useForm(collection, formRules)

const addCollection = async () => {
  await validate()
    .then(async () => {
      const { name } = collection.value

      const url = isEdit
        ? `/api/users/${uid}/collections/${collection.value.id}`
        : `/api/users/${uid}/collections`

      await $fetch(url, {
        method: 'post',
        body: collection.value,
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
