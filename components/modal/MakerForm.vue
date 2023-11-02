<template>
  <a-form layout="vertical">
    <a-form-item label="Name">
      <a-input v-model:value="maker.name" placeholder="Maker Name">
        <template #prefix><file-text-outlined /></template>
      </a-input>
    </a-form-item>

    <a-row :gutter="8">
      <a-col :xs="24" :md="12">
        <a-form-item label="Nationality">
          <a-input v-model:value="maker.nationality" :maxlength="2">
            <template #prefix><flag-outlined /></template>
          </a-input>
        </a-form-item>
      </a-col>
      <a-col :xs="24" :md="12">
        <a-form-item label="Founded">
          <a-input v-model:value="maker.founded">
            <template #prefix><calendar-outlined /></template>
          </a-input>
        </a-form-item>
      </a-col>
    </a-row>

    <a-form-item v-if="!isKeeb" label="Source">
      <a-input v-model:value="maker.src">
        <template #prefix><file-word-outlined /></template>
      </a-input>
    </a-form-item>
    <a-form-item label="Website">
      <a-input v-model:value="maker.website">
        <template #prefix><global-outlined /></template>
      </a-input>
    </a-form-item>
    <a-form-item label="Instagram">
      <a-input v-model:value="maker.instagram">
        <template #prefix><instagram-outlined /></template>
      </a-input>
    </a-form-item>
    <a-form-item label="Discord">
      <a-input v-model:value="maker.discord">
        <template #prefix>
          <span class="anticon">
            <icon name="la:discord" />
          </span>
        </template>
      </a-input>
    </a-form-item>
    <a-form-item label="Artisan Collector">
      <a-input v-model:value="maker.artisancollector">
        <template #prefix>
          <span class="anticon">
            <icon name="ArtisanCollectorIcon" size="18" />
          </span>
        </template>
      </a-input>
    </a-form-item>
    <a-form-item label="Introduce">
      <a-textarea v-model:value="maker.intro" auto-size />
    </a-form-item>
  </a-form>
</template>

<script setup>
import { message } from 'ant-design-vue'
import slugify from 'slugify'

const { metadata, isKeeb, isEdit } = defineProps({
  metadata: {
    type: Object,
    default() {
      return {}
    },
  },
  isKeeb: Boolean,
  isEdit: Boolean,
})

const maker = ref({})

onBeforeMount(() => {
  if (metadata && Object.keys(metadata).length) {
    maker.value = { ...metadata }
  }
})

const addMaker = () => {
  const { sculpts, ...rest } = maker.value

  const makerId = isEdit ? rest.id : slugify(maker.value.name, { lower: true })

  $fetch(`/api/makers/${makerId}`, {
    method: 'post',
    body: {
      ...rest,
      id: makerId,
    },
  })
    .then(() => {
      if (isEdit) {
        message.success('Maker updated successfully!')
      } else {
        message.success(`Maker [${rest.name}] added successfully!`)
      }
    })
    .catch((error) => {
      message.error(error.message)
    })
}

defineExpose({
  addMaker,
})
</script>
