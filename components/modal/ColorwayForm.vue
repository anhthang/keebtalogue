<template>
  <a-form :ref="formRef" :rules="formRules" :model="colorway" layout="vertical">
    <a-row :gutter="[8, 8]">
      <a-col :xs="24">
        <a-form-item
          ref="name"
          name="name"
          v-bind="validateInfos.name"
          label="Name"
        >
          <a-input v-model:value="colorway.name">
            <template #prefix><font-size-outlined /></template>
          </a-input>
        </a-form-item>
      </a-col>
    </a-row>

    <a-row :gutter="[8, 8]">
      <a-col :xs="12">
        <a-form-item
          ref="release"
          name="release"
          v-bind="validateInfos.release"
          label="Release"
        >
          <a-input v-model:value="colorway.release">
            <template #prefix><calendar-outlined /></template>
          </a-input>
        </a-form-item>
      </a-col>
      <a-col :xs="6" :sm="6">
        <a-form-item
          ref="quantity"
          name="quantity"
          v-bind="validateInfos.quantity"
          label="Quantity"
        >
          <a-input-number v-model:value="colorway.qty">
            <template #prefix><number-outlined /></template>
          </a-input-number>
        </a-form-item>
      </a-col>
      <a-col :xs="6" :sm="6">
        <a-form-item
          ref="order"
          name="order"
          v-bind="validateInfos.order"
          label="Order"
        >
          <a-input-number v-model:value="colorway.order">
            <template #prefix><number-outlined /></template>
          </a-input-number>
        </a-form-item>
      </a-col>
    </a-row>

    <a-row :gutter="[8, 8]">
      <a-col :xs="12">
        <a-form-item>
          <a-checkbox v-model:checked="colorway.giveaway">Giveaway</a-checkbox>
        </a-form-item>
      </a-col>
      <a-col :xs="12">
        <a-form-item>
          <a-checkbox
            v-model:checked="colorway.commissioned"
            :disabled="colorway.giveaway"
          >
            Commission
          </a-checkbox>
        </a-form-item>
      </a-col>
    </a-row>

    <a-row v-if="!colorway.giveaway && !colorway.commissioned" :gutter="[8, 8]">
      <a-col :xs="12">
        <a-form-item
          ref="price"
          name="price"
          v-bind="validateInfos.price"
          label="Price"
        >
          <a-input-group class="price-input-group" compact>
            <a-select v-model:value="colorway.currency" style="width: 30%">
              <a-select-option
                v-for="currency in currencies"
                :key="currency"
                :value="currency"
              >
                {{ currency }}
              </a-select-option>
            </a-select>
            <a-input-number
              v-model:value="colorway.price"
              :parser="(v) => v.replace(/\$\s?|(,*)/g, '')"
              style="width: 70%"
            />
          </a-input-group>
        </a-form-item>
      </a-col>
      <a-col :xs="12">
        <a-form-item
          ref="sale_type"
          name="sale_type"
          v-bind="validateInfos.class"
          label="Sale Type"
        >
          <a-select v-model:value="colorway.sale_type">
            <a-select-option key="Raffle" value="Raffle">
              Raffle
            </a-select-option>
            <a-select-option key="FCFS" value="FCFS">FCFS</a-select-option>
            <a-select-option key="Fulfillment" value="Fulfillment">
              Fulfillment
            </a-select-option>
            <!-- <a-select-option key="groupbuy" value="groupbuy">Group Buy</a-select-option> -->
          </a-select>
        </a-form-item>
      </a-col>
    </a-row>

    <a-form-item
      ref="description"
      name="description"
      v-bind="validateInfos.description"
      label="Description"
    >
      <a-textarea v-model:value="colorway.description" auto-size />
    </a-form-item>

    <a-form-item
      ref="image"
      name="image"
      v-bind="validateInfos.image"
      label="Image"
    >
      <a-upload-dragger
        v-model:fileList="fileList"
        list-type="picture"
        :max-count="1"
        name="colorway-image"
        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
        :before-upload="beforeUpload"
        @change="onImageChange"
      >
        <p class="ant-upload-drag-icon">
          <upload-outlined />
        </p>
        <p class="ant-upload-text">Click or drag file to this area to upload</p>
      </a-upload-dragger>
    </a-form-item>

    <!-- <a-form-item label="Tags">
      <a-select
        v-model:value="colorway.keycap"
        mode="multiple"
        label-in-value
        :filter-option="false"
        :not-found-content="fetching ? undefined : null"
        :options="keycaps"
        @search="fetchkeycaps"
      >
        <template v-if="fetching" #notFoundContent>
          <a-spin size="small" />
        </template>
      </a-select>
    </a-form-item> -->
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

const currencies = ['USD', 'EUR', 'CAD', 'SGD', 'MYR', 'CNY', 'VND']

const route = useRoute()
const colorway = ref({})

const formRef = ref()
const formRules = ref({
  name: [{ required: true, type: 'string', trigger: ['change', 'blur'] }],
  release: [{ type: 'string', trigger: ['change', 'blur'] }],
  quantity: [{ type: 'number', trigger: ['change', 'blur'] }],
  order: [{ required: true, type: 'number', trigger: ['change', 'blur'] }],
  price: [{ type: 'string', trigger: ['change', 'blur'] }],
  sale_type: [
    {
      type: 'enum',
      enum: ['Raffle', 'FCFS', 'Fulfillment'],
      trigger: ['change', 'blur'],
    },
  ],
  description: [{ type: 'string', trigger: ['change', 'blur'] }],
  image: [{ required: true, type: 'url' }],
})

onBeforeMount(() => {
  Object.assign(colorway.value, metadata)
  if (metadata.img) {
    fileList.value = [{ url: metadata.img }]
  }
})

const { useForm } = Form
const { validate, validateInfos } = useForm(colorway, formRules)

const addColorway = () => {
  validate()
    .then(() => {
      $fetch(
        `/api/makers/${route.params.maker}/sculpts/${route.params.sculpt}/colorways`,
        {
          method: 'post',
          body: colorway.value,
        },
      )
        .then(() => {
          message.success('Colorway updated successfully!')
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

// const fetching = ref(false)
// const keycaps = ref([])
// const fetchkeycaps = (val) => {
//   fetching.value = true
//   $fetch(`/api/keycaps?query=${val}`)
//     .then((data) => {
//       keycaps.value = data.map((k) => ({ key: k.id, value: k.name }))
//       fetching.value = false
//     })
//     .catch(() => {
//       fetching.value = false
//     })
// }

/**
 * Upload image
 */
const fileList = ref([])

const beforeUpload = (file) => {
  const isImg = file.type.startsWith('image')
  if (!isImg) {
    message.error(`${file.name} is not an image file`)
  }

  return isImg
}

const onImageChange = (info) => {
  const status = info.file.status
  if (status === 'done') {
    message.success(`${info.file.name} uploaded successfully.`)
  } else if (status === 'error') {
    message.error(`${info.file.name} upload failed.`)
  }
}

defineExpose({
  addColorway,
})
</script>
