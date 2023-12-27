<template>
  <a-form :ref="formRef" :rules="formRules" :model="keycap" layout="vertical">
    <a-row :gutter="[8, 8]">
      <a-col :xs="12">
        <a-form-item
          ref="name"
          name="name"
          label="Name"
          v-bind="validateInfos.name"
        >
          <a-input v-model:value="keycap.name">
            <template #prefix><font-size-outlined /></template>
          </a-input>
        </a-form-item>
      </a-col>
      <a-col :xs="12">
        <a-form-item
          ref="designer"
          name="designer"
          label="Designer"
          v-bind="validateInfos.designer"
        >
          <a-input v-model:value="keycap.designer">
            <template #prefix><font-size-outlined /></template>
          </a-input>
        </a-form-item>
      </a-col>
    </a-row>

    <a-row :gutter="[8, 8]">
      <a-col :xs="12">
        <a-form-item
          ref="profile_id"
          name="profile_id"
          label="Profile"
          v-bind="validateInfos.profile_id"
        >
          <a-select v-model:value="keycap.profile_id">
            <a-select-option
              v-for="[key, value] in Object.entries(allProfiles)"
              :key="key"
              :value="key"
            >
              {{ value }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :xs="12">
        <a-form-item
          ref="sculpt"
          name="sculpt"
          label="Sculpt"
          v-bind="validateInfos.sculpt"
        >
          <a-input v-model:value="keycap.sculpt">
            <!-- <template #prefix><font-size-outlined /></template> -->
          </a-input>
        </a-form-item>
      </a-col>
    </a-row>

    <a-form-item ref="url" name="url" label="URL" v-bind="validateInfos.url">
      <a-input v-model:value="keycap.url">
        <template #prefix><global-outlined /></template>
      </a-input>
    </a-form-item>

    <a-form-item ref="img" name="img" label="Image" v-bind="validateInfos.img">
      <a-input v-model:value="keycap.img">
        <template #prefix><picture-outlined /></template>
      </a-input>
    </a-form-item>

    <a-form-item label="Time">
      <a-range-picker
        v-model:value="keycap.dates"
        style="width: 100%"
        @change="onChangeDates"
      />
    </a-form-item>

    <a-form-item
      ref="order_graph"
      name="order_graph"
      label="Order Graph"
      v-bind="validateInfos.order_graph"
    >
      <a-input v-model:value="keycap.order_graph">
        <template #prefix><picture-outlined /></template>
      </a-input>
    </a-form-item>

    <a-form-item
      ref="history_graph"
      name="history_graph"
      label="History Graph"
      v-bind="validateInfos.history_graph"
    >
      <a-input v-model:value="keycap.history_graph">
        <template #prefix><picture-outlined /></template>
      </a-input>
    </a-form-item>

    <a-form-item
      ref="description"
      name="description"
      v-bind="validateInfos.description"
      label="Description"
    >
      <a-textarea v-model:value="keycap.description" auto-size />
    </a-form-item>
  </a-form>
</template>

<script setup>
import dayjs from 'dayjs'
import { Form } from 'ant-design-vue'
import slugify from 'slugify'

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
const keycap = ref({
  name: '',
  url: '',
  img: '',
  dates: [],
  profile_id: route.params.profile,
})

onBeforeMount(() => {
  Object.assign(keycap.value, metadata)
  if (metadata.start) {
    keycap.value.dates[0] = dayjs(metadata.start, 'YYYY-MM-DD')
  }
  if (metadata.end) {
    keycap.value.dates[1] = dayjs(metadata.end, 'YYYY-MM-DD')
  }
})

const formRef = ref()
const formRules = ref({
  name: [{ required: true, type: 'string', trigger: ['change', 'blur'] }],
  designer: [{ required: false, type: 'string', trigger: ['change', 'blur'] }],
  sculpt: [{ required: false, type: 'string', trigger: ['change', 'blur'] }],
  profile_id: [
    {
      required: true,
      type: 'enum',
      enum: Object.keys(allProfiles),
      trigger: ['change', 'blur'],
    },
  ],
  url: [{ required: true, type: 'url', trigger: ['change', 'blur'] }],
  img: [{ required: true, type: 'url', trigger: ['change', 'blur'] }],
  start: [{ required: false, type: 'date', trigger: ['change', 'blur'] }],
  end: [{ required: false, type: 'date', trigger: ['change', 'blur'] }],
  order_graph: [{ required: false, type: 'url', trigger: ['change', 'blur'] }],
  history_graph: [
    { required: false, type: 'url', trigger: ['change', 'blur'] },
  ],
  description: [{ type: 'string', trigger: ['change', 'blur'] }],
})

const onChangeDates = () => {
  keycap.value.start = keycap.value.dates[0].format('YYYY-MM-DD')
  keycap.value.end = keycap.value.dates[1].format('YYYY-MM-DD')
}

const { useForm } = Form
const { validate, validateInfos } = useForm(keycap, formRules)

const addKeycap = async () => {
  await validate().then(() => {
    const slug = isEdit
      ? keycap.value.id
      : slugify(keycap.value.name, { lower: true })

    if (!isEdit) {
      keycap.value.profile_keycap_id = `${keycap.value.profile_id}/${slug}`
    }

    $fetch(`/api/keycaps/${route.params.profile}/${slug}`, {
      method: 'post',
      body: keycap.value,
    })
      .then(() => {
        if (isEdit) {
          message.success(`[${keycap.value.name}] updated successfully!`)
        } else {
          message.success(`[${keycap.value.name}] added successfully!`)
        }
      })
      .catch((error) => {
        message.error(error.message)
      })
  })
}

defineExpose({
  addKeycap,
})
</script>
