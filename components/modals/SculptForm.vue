<template>
  <a-form layout="vertical">
    <a-row :gutter="[8, 8]">
      <a-col :xs="24">
        <a-form-item label="Name">
          <a-input v-model:value="sculpt.name">
            <template #prefix><font-size-outlined /></template>
          </a-input>
        </a-form-item>
      </a-col>
    </a-row>

    <a-row :gutter="[8, 8]">
      <a-col :xs="12">
        <a-form-item label="Release">
          <a-input v-model:value="sculpt.release">
            <template #prefix><calendar-outlined /></template>
          </a-input>
        </a-form-item>
      </a-col>
      <a-col :xs="12">
        <a-form-item label="Profile">
          <a-select v-model:value="sculpt.profile">
            <a-select-option key="sculpted" value="sculpted"
              >sculpted</a-select-option
            >
            <a-select-option key="blank" value="blank">blank</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
    </a-row>

    <a-row :gutter="[8, 8]">
      <a-col :xs="12">
        <a-form-item label="Cast">
          <a-select v-model:value="sculpt.cast">
            <a-select-option key="resin" value="resin">resin</a-select-option>
            <a-select-option key="mixed" value="mixed">mixed</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :xs="12">
        <a-form-item label="Design">
          <a-select v-model:value="sculpt.design">
            <a-select-option key="physical" value="physical"
              >physical</a-select-option
            >
            <a-select-option key="digital" value="digital"
              >digital</a-select-option
            >
            <a-select-option key="hybrid" value="hybrid"
              >hybrid</a-select-option
            >
          </a-select>
        </a-form-item>
      </a-col>
    </a-row>

    <a-form-item label="URL">
      <a-input v-model:value="sculpt.href">
        <template #prefix><link-outlined /></template>
      </a-input>
    </a-form-item>

    <a-form-item label="Story">
      <a-textarea v-model:value="sculpt.story" auto-size />
    </a-form-item>
  </a-form>
</template>

<script setup>
import { message } from 'ant-design-vue'

const { metadata, isEdit } = defineProps({
  metadata: Object,
  isEdit: Boolean,
})

const route = useRoute()
const sculpt = ref({
  maker_id: route.params.maker,
  sculpt_id: route.params.sculpt,
})

onBeforeMount(() => {
  const { colorways, ...rest } = metadata

  Object.assign(sculpt.value, rest)
})

const addSculptProfile = () => {
  $fetch(`/api/makers/${route.params.maker}/sculpts/${route.params.sculpt}`, {
    method: 'post',
    body: sculpt.value,
  })
    .then(() => {
      if (isEdit) {
        message.success('Sculpt profile updated succesful')
      } else {
        message.success('Successfully added new sculpt profile')
      }
    })
    .catch((error) => {
      message.error(error.message)
    })
}

defineExpose({
  addSculptProfile,
})
</script>
