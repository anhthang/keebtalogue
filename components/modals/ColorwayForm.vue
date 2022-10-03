<template>
  <a-form layout="vertical">
    <a-form-item label="Colorway">
      <a-select
        v-model:value="colorway.colorway_id"
        show-search
        @select="onSelectColorway"
      >
        <a-select-option
          v-for="clw in metadata"
          :key="clw.colorway_id"
          :value="clw.colorway_id"
        >
          {{ clw.name }}
        </a-select-option>
      </a-select>
    </a-form-item>

    <a-row :gutter="[8, 8]">
      <a-col :xs="12">
        <a-form-item label="Release">
          <a-input v-model:value="colorway.release">
            <template #prefix><calendar-outlined /></template>
          </a-input>
        </a-form-item>
      </a-col>
      <a-col :xs="12">
        <a-form-item label="Quantity">
          <a-input-number v-model:value="colorway.qty">
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

    <a-row :gutter="[8, 8]" v-if="!colorway.giveaway">
      <a-col :xs="12">
        <a-form-item label="Price">
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
    </a-row>

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

const colorwayMap = keyBy(metadata, "colorway_id");
const currencies = ["USD", "EUR", "CAD", "SGD", "MYR", "CNY", "VND"];

const route = useRoute();
const colorway = ref({
  maker_id: route.params.maker,
  sculpt_id: route.params.sculpt,
});

const onSelectColorway = (clwId) => {
  // exclude some data that we don't store in our database
  const { isCover, note, order, ...rest } = colorwayMap[clwId];

  Object.assign(colorway.value, rest);
};

const addColorway = () => {
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
