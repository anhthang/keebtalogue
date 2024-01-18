<template>
  <a-form
    :ref="formRef"
    :rules="formRules"
    :model="collection"
    layout="vertical"
  >
    <a-form-item
      ref="name"
      name="name"
      label="Name"
      v-bind="validateInfos.name"
    >
      <a-input v-model:value="collection.name">
        <template #prefix><font-size-outlined /></template>
      </a-input>
    </a-form-item>

    <a-divider />

    <a-form-item label="Visibility">
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
        <a-radio :value="false"><lock-outlined /> Private</a-radio>
        <a-radio :value="true"><unlock-outlined /> Public</a-radio>
      </a-radio-group>
    </a-form-item>

    <a-form-item v-if="collection.published">
      <a-radio-group v-model:value="collection.type">
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

    <a-form-item
      v-if="collection.published && collection.type !== 'share'"
      ref="message"
      name="message"
      label="Message"
      v-bind="validateInfos.message"
    >
      <a-input v-model:value="collection.message">
        <template #prefix><field-string-outlined /></template>
      </a-input>
      <template #extra>
        Describe what you're offering and/or help others understand what types
        of offers you are looking for. Your message should be applicable to many
        people using the marketplace, not just a specific person.
      </template>
    </a-form-item>

    <a-form-item
      v-if="collection.published && collection.type !== 'share'"
      ref="contact"
      name="contact"
      label="Contact"
      v-bind="validateInfos.contact"
    >
      <a-input v-model:value="collection.contact">
        <template #prefix>
          <span class="anticon">
            <icon name="la:discord" />
          </span>
        </template>
      </a-input>
      <template #extra>
        Please enter your Discord username so that buyer/seller can reach you
        directly.
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

const userStore = useUserStore()

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
  message: [{ required: false, type: 'string', trigger: ['change', 'blur'] }],
  contact: [{ required: false, type: 'string', trigger: ['change', 'blur'] }],
})

const { useForm } = Form
const { validate, validateInfos } = useForm(collection, formRules)

const addCollection = async () => {
  await validate()
    .then(async () => {
      const { items, ...rest } = collection.value

      const url = isEdit
        ? `/api/users/${uid}/collections/${rest.id}`
        : `/api/users/${uid}/collections`

      await $fetch(url, {
        method: 'post',
        body: rest,
      })
        .then(() => {
          if (isEdit) {
            message.success(`Collection [${rest.name}] updated successfully!`)
          } else {
            message.success(`Collection [${rest.name}] added successfully!`)
          }
        })
        .catch((error) => {
          message.error(error.message)
        })
    })
    .catch(() => {
      // ignore
    })

  await userStore.getUserDocument(uid)
}

defineExpose({
  addCollection,
})
</script>
