<template>
  <a-form layout="vertical">
    <a-form-item label="Name">
      <a-input v-model:value="sculpt.name">
        <template #prefix><font-size-outlined /></template>
      </a-input>
    </a-form-item>
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
import { message } from "ant-design-vue";

const { metadata, isEdit } = defineProps({
  metadata: Object,
  isEdit: Boolean,
});

const route = useRoute();
const sculpt = ref({
  maker_id: route.params.maker,
  sculpt_id: route.params.sculpt,
});

onBeforeMount(() => {
  const { colorways, ...rest } = metadata;

  Object.assign(sculpt.value, rest);
});

const addSculptProfile = () => {
  $fetch(`/api/makers/${route.params.maker}/sculpts/${route.params.sculpt}`, {
    method: "post",
    body: sculpt.value,
  })
    .then(() => {
      if (isEdit) {
        message.success("Sculpt profile updated succesful");
      } else {
        message.success("Successfully added new sculpt profile");
      }
    })
    .catch((error) => {
      message.error(error.message);
    });
};

defineExpose({
  addSculptProfile,
});
</script>
