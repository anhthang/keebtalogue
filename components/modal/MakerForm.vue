<template>
  <a-form :ref="formRef" layout="vertical" :model="maker" :rules="formRules">
    <a-form-item
      ref="name"
      name="name"
      v-bind="validateInfos.name"
      label="Name"
    >
      <a-input v-model:value="maker.name" placeholder="Maker Name">
        <template #prefix><file-text-outlined /></template>
      </a-input>
    </a-form-item>

    <a-row :gutter="8">
      <a-col :xs="24" :md="12">
        <a-form-item
          ref="nationality"
          name="nationality"
          v-bind="validateInfos.nationality"
          label="Nationality"
        >
          <a-input v-model:value="maker.nationality" :maxlength="2">
            <template #prefix><flag-outlined /></template>
          </a-input>
        </a-form-item>
      </a-col>
      <a-col :xs="24" :md="12">
        <a-form-item
          ref="founded"
          name="founded"
          v-bind="validateInfos.founded"
          label="Founded"
        >
          <a-input v-model:value="maker.founded">
            <template #prefix><calendar-outlined /></template>
          </a-input>
        </a-form-item>
      </a-col>
    </a-row>

    <a-form-item
      v-for="(docId, idx) in maker.document_ids"
      :key="idx"
      :label="idx == 0 ? 'Document Id' : undefined"
      :name="['document_ids', idx]"
      v-bind="validateInfos.document_ids"
      :rules="{ required: true, type: 'string', trigger: ['change', 'blur'] }"
    >
      <a-input v-model:value="maker.document_ids[idx]">
        <template #prefix><file-word-outlined /></template>
        <template #suffix>
          <minus-circle-outlined @click="removeDocId(docId)" />
        </template>
      </a-input>
    </a-form-item>
    <a-form-item>
      <a-button type="dashed" style="width: 100%" @click="addDocId">
        <plus-circle-outlined /> Add Document Id
      </a-button>
    </a-form-item>

    <a-form-item
      ref="website"
      name="website"
      v-bind="validateInfos.website"
      label="Website"
    >
      <a-input v-model:value="maker.website">
        <template #prefix><global-outlined /></template>
      </a-input>
    </a-form-item>

    <a-form-item
      ref="instagram"
      name="instagram"
      v-bind="validateInfos.instagram"
      label="Instagram"
    >
      <a-input v-model:value="maker.instagram">
        <template #prefix><instagram-outlined /></template>
      </a-input>
    </a-form-item>

    <a-form-item
      ref="discord"
      name="discord"
      v-bind="validateInfos.discord"
      label="Discord"
    >
      <a-input v-model:value="maker.discord">
        <template #prefix>
          <span class="anticon">
            <icon name="la:discord" />
          </span>
        </template>
      </a-input>
    </a-form-item>

    <a-form-item
      ref="artisancollector"
      name="artisancollector"
      v-bind="validateInfos.artisancollector"
      label="Artisan Collector"
    >
      <a-input v-model:value="maker.artisancollector">
        <template #prefix>
          <span class="anticon">
            <icon name="ArtisanCollectorIcon" size="18" />
          </span>
        </template>
      </a-input>
    </a-form-item>

    <a-form-item
      ref="intro"
      name="intro"
      v-bind="validateInfos.intro"
      label="Introduce"
    >
      <a-textarea v-model:value="maker.intro" auto-size />
    </a-form-item>
  </a-form>
</template>

<script setup>
import slugify from 'slugify'
import { Form } from 'ant-design-vue'

const { metadata, isEdit } = defineProps({
  metadata: {
    type: Object,
    default() {
      return {}
    },
  },
  isKeeb: Boolean,
  isEdit: Boolean,
})

const maker = ref({
  name: '',
})

onBeforeMount(() => {
  if (metadata && Object.keys(metadata).length) {
    maker.value = { ...metadata }
  }
})

const formRef = ref()
const formRules = ref({
  name: [{ required: true, type: 'string', trigger: ['change', 'blur'] }],
  nationality: [{ len: 2, trigger: ['change', 'blur'] }],
  founded: [{ required: false, trigger: ['change', 'blur'] }],
  // document_ids: [
  //   {
  //     required: true,
  //     type: 'array',
  //     defaultField: { type: 'string', required: true },
  //   },
  // ],
  website: [{ type: 'url', trigger: ['change', 'blur'] }],
  instagram: [{ type: 'url', trigger: ['change', 'blur'] }],
  discord: [{ type: 'url', trigger: ['change', 'blur'] }],
  artisancollector: [{ type: 'url', trigger: ['change', 'blur'] }],
  intro: [{ type: 'string', trigger: ['change', 'blur'] }],
})

const addDocId = () => {
  if (!Array.isArray(maker.value.document_ids)) {
    maker.value.document_ids = ['']
  } else {
    maker.value.document_ids.push('')
  }
}

const removeDocId = (docIdx) => {
  maker.value.document_ids = maker.value.document_ids.filter(
    (d) => d !== docIdx,
  )
}

const { useForm } = Form
const { validate, validateInfos } = useForm(maker, formRules)

const addMaker = async () => {
  await validate().then(() => {
    const { sculpts, ...rest } = maker.value

    const makerId = isEdit
      ? rest.id
      : slugify(maker.value.name, { lower: true })

    $fetch(`/api/makers/${makerId}`, {
      method: 'post',
      body: {
        ...rest,
        id: makerId,
      },
    })
      .then(() => {
        if (isEdit) {
          message.success(`[${rest.name}] updated successfully!`)
        } else {
          message.success(`[${rest.name}] added successfully!`)
        }
      })
      .catch((error) => {
        message.error(error.message)
      })
  })
}

defineExpose({
  addMaker,
})
</script>
