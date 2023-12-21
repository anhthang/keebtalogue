<template>
  <a-form :ref="formRef" :rules="formRules" :model="keycap" layout="vertical">
    <a-row :gutter="[8, 8]">
      <a-col :xs="24">
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
    </a-row>

    <a-row :gutter="[8, 8]">
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
      <a-col :xs="12">
        <a-form-item
          ref="profile_id"
          name="profile_id"
          label="Profile"
          v-bind="validateInfos.profile_id"
        >
          <a-select v-model:value="keycap.profile_id">
            <a-select-option
              v-for="profile in profiles"
              :key="profile.key"
              :value="profile.key"
            >
              {{ profile.value }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
    </a-row>

    <a-row :gutter="[8, 8]">
      <a-col :xs="24">
        <a-form-item
          ref="url"
          name="url"
          label="URL"
          v-bind="validateInfos.url"
        >
          <a-input v-model:value="keycap.url">
            <template #prefix><global-outlined /></template>
          </a-input>
        </a-form-item>
      </a-col>
      <a-col :xs="24">
        <a-form-item label="Time">
          <a-range-picker
            v-model:value="keycap.dates"
            style="width: 100%"
            @change="onChangeDates"
          />
        </a-form-item>
      </a-col>
    </a-row>
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
  dates: [],
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

const profiles = [
  { key: 'gmk', value: 'GMK CYL' },
  { key: 'gmk-mtnu', value: 'GMK MTNU' },
  { key: 'sa', value: 'SA' },
  { key: 'jtk', value: 'JTK' },
]

const formRef = ref()
const formRules = ref({
  name: [{ required: true, type: 'string', trigger: ['change', 'blur'] }],
  designer: [{ required: false, type: 'string', trigger: ['change', 'blur'] }],
  profile_id: [
    {
      required: true,
      type: 'enum',
      enum: profiles.map((p) => p.key),
      trigger: ['change', 'blur'],
    },
  ],
  url: [{ required: true, type: 'url', trigger: ['change', 'blur'] }],
  start: [{ required: false, type: 'date', trigger: ['change', 'blur'] }],
  end: [{ required: false, type: 'date', trigger: ['change', 'blur'] }],
})

const onChangeDates = () => {
  keycap.value.start = keycap.value.dates[0].format('YYYY-MM-DD')
  keycap.value.end = keycap.value.dates[1].format('YYYY-MM-DD')
}

const { useForm } = Form
const { validate, validateInfos } = useForm(keycap, formRules)

const addKeycap = () => {
  validate()
    .then(() => {
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
            message.success('Keycap updated successfully!')
          } else {
            message.success('New keycap added successfully!')
          }
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
  addKeycap,
})
</script>
