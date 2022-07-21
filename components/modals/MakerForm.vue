<template>
  <a-form layout="vertical">
    <a-form-item label="Name">
      <a-input
        v-model:value="maker.name"
        placeholder="Maker Name"
        :disabled="isEdit"
      >
        <template #prefix><file-text-outlined /></template>
      </a-input>
    </a-form-item>
    <a-form-item label="Logo">
      <a-input v-model:value="maker.img" :disabled="!isKeeb">
        <template #prefix><file-image-outlined /></template>
      </a-input>
    </a-form-item>
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
        <template #prefix><aliwangwang-outlined /></template>
      </a-input>
    </a-form-item>
    <a-form-item label="Nationality">
      <a-input v-model:value="maker.nationality" :maxlength="2">
        <template #prefix><flag-outlined /></template>
      </a-input>
    </a-form-item>
    <a-form-item label="Introduce">
      <a-textarea v-model:value="maker.intro" auto-size />
    </a-form-item>
  </a-form>
</template>

<script setup>
import { message } from "ant-design-vue";
import crc32 from "crc/crc32";
import slugify from "slugify";

const { metadata, isKeeb, isEdit } = defineProps({
  metadata: Object,
  isKeeb: Boolean,
  isEdit: Boolean,
});

const maker = ref({});

watch(
  () => maker.value.name,
  () => {
    if (!isKeeb) {
      const id = crc32(maker.value.name).toString(16);
      maker.value.img = `https://github.com/keycap-archivist/website/raw/master/src/assets/img/logos/${id}.jpg`;
    }
  }
);

const makerId = computed(() => {
  return isKeeb
    ? slugify(maker.value.name, { lower: true })
    : maker.value.name // make it same as keycap-archivist
        .replaceAll(" ", "-")
        .replaceAll(".", "-")
        .toLowerCase();
});

onBeforeMount(() => {
  if (metadata && Object.keys(metadata).length) {
    maker.value = { ...metadata };
  }
});

const collectionName = computed(() =>
  isKeeb ? "keyboard-makers" : "artisan-makers"
);

const addMaker = () => {
  const { sculpts, ...rest } = maker.value;
  const endpoint = isEdit ? "/api/firestore/put" : "/api/firestore/add";

  $fetch(endpoint, {
    method: "post",
    params: {
      col: "artisan-makers",
      doc: makerId.value,
    },
    body: rest,
  })
    .then(() => {
      if (isEdit) {
        message.success("Maker profile updated succesful");
      } else {
        message.success("Successfully added new maker");
      }
    })
    .catch((error) => {
      message.error(error.message);
    });
};

defineExpose({
  addMaker,
});
</script>
