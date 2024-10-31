<template>
  <div class="flex flex-col gap-6">
    <div class="flex flex-col gap-2">
      <label for="maker_name">Name</label>
      <IconField>
        <InputIcon class="pi pi-pencil" />
        <InputText
          id="maker_name"
          v-model.trim="maker.name"
          type="text"
          fluid
        />
        <InputIcon
          v-if="maker.verified"
          v-tooltip="'Verified'"
          class="pi pi-verified text-[#22c55e] dark:text-[#4ade80]"
        />
      </IconField>
    </div>

    <div v-if="isAdmin" class="flex items-center gap-2">
      <Checkbox v-model="maker.verified" input-id="maker_verified" binary />
      <label for="maker_verified">Verified</label>
    </div>

    <div class="grid grid-cols-2 gap-2">
      <div class="flex flex-col gap-2">
        <label for="maker_nationality">Nationality</label>
        <IconField>
          <InputIcon class="pi pi-flag" />
          <InputText
            id="maker_nationality"
            v-model.trim="maker.nationality"
            type="text"
            fluid
          />
        </IconField>
      </div>
      <div class="flex flex-col gap-2">
        <label for="maker_founded">Founded</label>
        <IconField>
          <InputIcon class="pi pi-calendar" />
          <InputText
            id="maker_founded"
            v-model="maker.founded"
            v-keyfilter.num
            fluid
          />
        </IconField>
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <label for="maker_doc_id">Document ID</label>
      <IconField
        v-for="(docId, idx) in maker.document_ids"
        id="maker_doc_id"
        :key="docId"
      >
        <InputIcon class="pi pi-file-word" />
        <InputText :key="idx" v-model.trim="maker.document_ids[idx]" fluid />
        <InputIcon
          v-tooltip="'Remove'"
          class="pi pi-minus-circle cursor-pointer"
          @click="removeDocId(docId)"
        />
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
      <IconField>
        <InputIcon class="pi pi-globe" />
        <InputText
          id="maker_website"
          v-model.trim="maker.website"
          type="url"
          fluid
        />
      </IconField>
    </div>

    <div class="flex flex-col gap-2">
      <label for="maker_instagram">Instagram</label>
      <IconField>
        <InputIcon class="pi pi-instagram" />
        <InputText
          id="maker_instagram"
          v-model.trim="maker.instagram"
          type="url"
          fluid
        />
      </IconField>
    </div>

    <div class="flex flex-col gap-2">
      <label for="maker_discord">Discord</label>
      <IconField>
        <InputIcon class="pi pi-discord" />
        <InputText
          id="maker_discord"
          v-model.trim="maker.discord"
          type="url"
          fluid
        />
      </IconField>
    </div>

    <div class="flex flex-col gap-2">
      <label for="maker_artisancollector">ArtisanCollector</label>
      <IconField>
        <InputIcon class="pi pi-globe" />
        <InputText
          id="maker_artisancollector"
          v-model.trim="maker.artisancollector"
          type="url"
          fluid
        />
      </IconField>
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
      <Button label="Save" @click="onSubmit" />
    </div>

    <Toast />
  </div>
</template>

<script setup>
import slugify from 'slugify'

const emit = defineEmits(['onSuccess'])

const userStore = useUserStore()
const { isAdmin } = storeToRefs(userStore)

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

const onSubmit = async () => {
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
        emit('onSuccess', true)
      } else {
        toast.add({
          severity: 'success',
          summary: `[${rest.name}] added successfully!`,
          life: 3000,
        })
        emit('onSuccess', true)
      }
    })
    .catch((error) => {
      toast.add({ severity: 'error', summary: error.message, life: 3000 })
    })
}
</script>
