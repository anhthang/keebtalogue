<template>
  <a-form layout="vertical">
    <a-form-item label="Colorway">
      <a-select v-model:value="colorway.colorway_id" show-search>
        <a-select-option v-for="clw in metadata" :key="clw.id" :value="clw.id">
          {{ clw.name }}
        </a-select-option>
      </a-select>
    </a-form-item>

    <a-form-item label="Description">
      <a-textarea v-model:value="colorway.description" auto-size />
    </a-form-item>
  </a-form>
</template>

<script setup>
import { message } from "ant-design-vue";
import keyBy from "lodash.keyby";

const { metadata } = defineProps({
  metadata: Object,
});

const route = useRoute();
const colorway = ref({
  maker_id: route.params.maker,
  sculpt_id: route.params.sculpt,
});

const addColorway = () => {
  colorway.value.name = keyBy(metadata, "id")[colorway.value.colorway_id].name;

  $fetch(
    `/api/makers/${route.params.maker}/sculpts/${route.params.sculpt}/colorways`,
    {
      method: "post",
      body: colorway.value,
    }
  )
    .then(() => {
      message.success("Colorway information updated successfully");
    })
    .catch((error) => {
      message.error(error.message);
    });
};

defineExpose({
  addColorway,
});
</script>
