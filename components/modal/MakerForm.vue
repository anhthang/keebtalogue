<template>
  <div class="flex flex-col gap-6">
    <div class="flex flex-col gap-2">
      <label for="maker_name">Name</label>
      <InputText id="maker_name" v-model.trim="maker.name" type="text" />
    </div>
    <div class="grid grid-cols-2 gap-2">
      <div class="flex flex-col gap-2">
        <label for="maker_nationality">Nationality</label>
        <InputText
          id="maker_nationality"
          v-model.trim="maker.nationality"
          type="text"
        />
      </div>
      <div class="flex flex-col gap-2">
        <label for="maker_founded">Founded</label>
        <InputText id="maker_founded" v-model="maker.founded" v-keyfilter.num />
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <label for="maker_doc_id">Document ID</label>
      <IconField
        v-for="(docId, idx) in maker.document_ids"
        id="maker_doc_id"
        :key="docId"
      >
        <InputText :key="idx" v-model.trim="maker.document_ids[idx]" fluid />
        <InputIcon class="pi pi-minus-circle" @click="removeDocId(docId)" />
      </IconField>
      <Button
        severity="secondary"
        outlined
        label="Add Document Id"
        icon="pi pi-file-plus"
        @click="addDocId"
      />
    </div>

    <div class="flex flex-col gap-2">
      <label for="maker_website">Website</label>
      <InputText id="maker_website" v-model.trim="maker.website" type="url" />
    </div>
    <div class="flex flex-col gap-2">
      <label for="maker_instagram">Instagram</label>
      <InputText
        id="maker_instagram"
        v-model.trim="maker.instagram"
        type="url"
      />
    </div>
    <div class="flex flex-col gap-2">
      <label for="maker_discord">Discord</label>
      <InputText id="maker_discord" v-model.trim="maker.discord" type="url" />
    </div>
    <div class="flex flex-col gap-2">
      <label for="maker_artisancollector">ArtisanCollector</label>
      <InputText
        id="maker_artisancollector"
        v-model.trim="maker.artisancollector"
        type="url"
      />
    </div>
    <div class="flex flex-col gap-2">
      <label for="maker_intro">Intro</label>
      <Textarea
        id="maker_intro"
        v-model.trim="maker.intro"
        :rows="5"
        auto-resize
      />
    </div>
    <div class="flex flex-col gap-2">
      <Button label="Save" @click="addMaker" />
    </div>

    <Toast />
  </div>
  <!-- <a-form :ref="formRef" layout="vertical" :model="maker" :rules="formRules">
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
  </a-form> -->
</template>

<script setup>
import slugify from 'slugify'

const toast = useToast()

const { metadata, isEdit } = defineProps({
  metadata: {
    type: Object,
    default: () => ({}),
  },
  isKeeb: Boolean,
  isEdit: Boolean,
})

const maker = ref({
  name: '',
})

onBeforeMount(() => {
  if (Object.keys(metadata).length) {
    maker.value = { ...metadata }
  }
})

// const formRules = ref({
//   name: [{ required: true, type: 'string', trigger: ['change', 'blur'] }],
//   nationality: [{ len: 2, trigger: ['change', 'blur'] }],
//   founded: [{ required: false, trigger: ['change', 'blur'] }],
//   // document_ids: [
//   //   {
//   //     required: true,
//   //     type: 'array',
//   //     defaultField: { type: 'string', required: true },
//   //   },
//   // ],
//   website: [{ type: 'url', trigger: ['change', 'blur'] }],
//   instagram: [{ type: 'url', trigger: ['change', 'blur'] }],
//   discord: [{ type: 'url', trigger: ['change', 'blur'] }],
//   artisancollector: [{ type: 'url', trigger: ['change', 'blur'] }],
//   intro: [{ type: 'string', trigger: ['change', 'blur'] }],
// })

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

const addMaker = async () => {
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
        toast.add({
          severity: 'success',
          summary: `[${rest.name}] updated successfully!`,
          life: 3000,
        })
      } else {
        toast.add({
          severity: 'success',
          summary: `[${rest.name}] added successfully!`,
          life: 3000,
        })
      }
    })
    .catch((error) => {
      toast.add({ severity: 'error', summary: error.message, life: 3000 })
    })
}
</script>
