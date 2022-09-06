<template>
  <a-form layout="vertical">
    <a-form-item label="Sculpt">
      <a-select v-model:value="sale.sculpt_id" show-search>
        <a-select-option
          v-for="sculpt in metadata"
          :key="sculpt.value"
          :value="sculpt.value"
        >
          {{ sculpt.title }}
        </a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item label="Title/Colorway">
      <a-textarea v-model:value="sale.title" auto-size />
    </a-form-item>
    <a-form-item label="Sale Date">
      <a-calendar v-model:value="sale.date" :fullscreen="false" />
    </a-form-item>
  </a-form>
</template>

<script setup>
import { message } from "ant-design-vue";

const { metadata } = defineProps({
  metadata: Array,
});

const route = useRoute();
const sale = ref({
  maker_id: route.params.maker,
});

const addSale = () => {
  const body = {
    ...sale.value,
    date: sale.value.date.format("YYYY-MM-DD"),
  };

  $fetch("/api/sales", {
    method: "post",
    body,
  })
    .then(() => {
      message.success("Sale added succesfully.");
    })
    .catch((error) => {
      message.error(error.message);
    });
};

defineExpose({
  addSale,
});
</script>
