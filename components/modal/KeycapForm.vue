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
          <a-select v-model:value="keycap.profile_id" :disabled="isEdit">
            <a-select-option
              v-for="[key, value] in Object.entries(manufacturers)"
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

    <a-form-item
      ref="render_img"
      name="render_img"
      label="Render"
      v-bind="validateInfos.render_img"
    >
      <a-input v-model:value="keycap.render_img">
        <template #prefix><picture-outlined /></template>
      </a-input>
    </a-form-item>

    <a-form-item
      ref="cover_img"
      name="cover_img"
      label="Cover"
      v-bind="validateInfos.cover_img"
    >
      <a-input v-model:value="keycap.cover_img">
        <template #prefix><picture-outlined /></template>
      </a-input>
    </a-form-item>

    <a-row v-if="ic" :gutter="[8, 8]">
      <a-col :xs="12">
        <a-form-item label="Status">
          <a-select v-model:value="keycap.status" disabled>
            <a-select-option
              v-for="status in Object.keys(keycapStatuses)"
              :key="status"
              :value="status"
            >
              {{ status }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :xs="12">
        <a-form-item label="Time">
          <a-date-picker
            v-model:value="keycap.dates[0]"
            style="width: 100%"
            @change="onChangeDates"
          />
        </a-form-item>
      </a-col>
    </a-row>
    <a-row v-else>
      <a-col :xs="24">
        <a-form-item label="Status">
          <a-select v-model:value="keycap.status">
            <a-select-option
              v-for="status in Object.keys(keycapStatuses)"
              :key="status"
              :value="status"
              :disabled="status === 'Interest Check'"
            >
              {{ status }}
            </a-select-option>
          </a-select>
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
      ref="order_history"
      name="order_history"
      label="Order History"
      v-bind="validateInfos.order_history"
    >
      <a-input v-model:value="keycap.order_history">
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
const ic = route.params.profile === 'interest-check'

const keycap = ref({
  name: '',
  url: '',
  render_img: '',
  dates: [],
  profile_id: ic ? '' : route.params.profile,
  status: ic ? 'Interest Check' : '',
})

onBeforeMount(() => {
  Object.assign(keycap.value, metadata)
  if (metadata.start_date) {
    keycap.value.dates[0] = dayjs(metadata.start_date, 'YYYY-MM-DD')
  }
  if (metadata.end_date) {
    keycap.value.dates[1] = dayjs(metadata.end_date, 'YYYY-MM-DD')
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
      enum: Object.keys(manufacturers),
      trigger: ['change', 'blur'],
    },
  ],
  url: [{ required: true, type: 'url', trigger: ['change', 'blur'] }],
  render_img: [{ required: false, type: 'url', trigger: ['change', 'blur'] }],
  cover_img: [{ required: false, type: 'url', trigger: ['change', 'blur'] }],
  start_date: [{ required: false, type: 'date', trigger: ['change', 'blur'] }],
  end_date: [{ required: false, type: 'date', trigger: ['change', 'blur'] }],
  status: [
    {
      required: false,
      type: 'enum',
      enum: Object.keys(keycapStatuses),
      trigger: ['change', 'blur'],
    },
  ],
  order_graph: [{ required: false, type: 'url', trigger: ['change', 'blur'] }],
  order_history: [
    { required: false, type: 'url', trigger: ['change', 'blur'] },
  ],
  description: [{ type: 'string', trigger: ['change', 'blur'] }],
})

const onChangeDates = () => {
  const [start, end] = keycap.value.dates
  if (start) {
    keycap.value.start_date = keycap.value.dates[0].format('YYYY-MM-DD')
  }
  if (end) {
    keycap.value.end_date = keycap.value.dates[1].format('YYYY-MM-DD')
  }
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

    /**
     * FIXME: maybe we need to change this
     * this is workaroundto handle updating render_img and refresh cdn image
     */
    if (
      metadata.render_img &&
      metadata.render_img !== keycap.value.render_img
    ) {
      keycap.value.img = ''
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
