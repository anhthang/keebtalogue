<template>
  <div class="flex flex-col gap-6">
    <div class="grid grid-cols-2 gap-2">
      <div class="flex flex-col gap-2">
        <label for="keycap_name">Name</label>
        <InputText id="keycap_name" v-model.trim="keycap.name" type="text" />
      </div>
      <div class="flex flex-col gap-2">
        <label for="keycap_designer">Designer</label>
        <InputText
          id="keycap_designer"
          v-model.trim="keycap.designer"
          type="text"
        />
      </div>
    </div>
    <div class="grid grid-cols-2 gap-2">
      <div class="flex flex-col gap-2">
        <label for="keycap_profile">Profile</label>
        <Select
          id="keycap_profile"
          v-model="keycap.profile_id"
          option-label="label"
          option-value="value"
          :options="
            Object.entries(manufacturers).map(([value, label]) => ({
              label,
              value,
            }))
          "
        />
      </div>
      <div class="flex flex-col gap-2">
        <label for="keycap_sculpt">Sculpt</label>
        <InputText
          id="keycap_sculpt"
          v-model.trim="keycap.sculpt"
          type="text"
        />
      </div>
    </div>
    <div class="flex flex-col gap-2">
      <label for="keycap_url">URL</label>
      <InputText id="keycap_url" v-model.trim="keycap.url" type="url" />
    </div>
    <div class="flex flex-col gap-2">
      <label for="keycap_render">Render</label>
      <InputText
        id="keycap_render"
        v-model.trim="keycap.render_img"
        type="url"
      />
    </div>
    <div class="flex flex-col gap-2">
      <label for="keycap_cover">Cover</label>
      <InputText id="keycap_cover" v-model.trim="keycap.cover_img" type="url" />
    </div>
    <div class="grid grid-cols-2 gap-2">
      <div class="flex flex-col gap-2">
        <label for="keycap_status">Status</label>
        <Select
          id="keycap_status"
          v-model="keycap.status"
          :options="Object.keys(keycapStatuses)"
        />
      </div>
      <div class="flex flex-col gap-2">
        <label for="keycap_ic">IC Date</label>
        <DatePicker v-model="keycap.ic_date" show-icon icon-display="input" />
      </div>
    </div>
    <div v-if="!ic" class="flex flex-col gap-2">
      <label for="keycap_gb">GB Time</label>
      <DatePicker
        id="keycap_gb"
        v-model="keycap.dates"
        selection-mode="range"
        show-icon
        icon-display="input"
      />
    </div>
    <div class="flex flex-col gap-2">
      <label for="keycap_graph">Order Graph</label>
      <InputText
        id="keycap_graph"
        v-model.trim="keycap.order_graph"
        type="url"
      />
    </div>
    <div class="flex flex-col gap-2">
      <label for="keycap_history">Order History</label>
      <InputText
        id="keycap_history"
        v-model.trim="keycap.order_history"
        type="url"
      />
    </div>
    <div class="flex flex-col gap-2">
      <label for="keycap_description">Description</label>
      <Textarea
        id="keycap_description"
        v-model.trim="keycap.description"
        :rows="5"
        auto-resize
      />
    </div>
    <div class="flex flex-col gap-2">
      <Button label="Save" @click="addKeycap" />
    </div>

    <Toast />
  </div>
</template>

<script setup>
import slugify from 'slugify'

const toast = useToast()

const { metadata, isEdit } = defineProps({
  metadata: {
    type: Object,
    default: () => ({}),
  },
  isEdit: Boolean,
})

const route = useRoute()

onBeforeMount(() => {
  const { page, size, ...rest } = metadata
  Object.assign(keycap.value, rest)
})

const keycap = ref({
  name: '',
  url: '',
  render_img: '',
  dates: [],
})

const ic = computed(() => keycap.value.status === 'Interest Check')

// const formRules = ref({
//   name: [{ required: true, type: 'string', trigger: ['change', 'blur'] }],
//   designer: [{ required: false, type: 'string', trigger: ['change', 'blur'] }],
//   sculpt: [{ required: false, type: 'string', trigger: ['change', 'blur'] }],
//   profile_id: [
//     {
//       required: true,
//       type: 'enum',
//       enum: Object.keys(manufacturers),
//       trigger: ['change', 'blur'],
//     },
//   ],
//   url: [{ required: true, type: 'url', trigger: ['change', 'blur'] }],
//   render_img: [{ required: false, type: 'url', trigger: ['change', 'blur'] }],
//   cover_img: [{ required: false, type: 'url', trigger: ['change', 'blur'] }],
//   ic_date: [{ required: false, type: 'date', trigger: ['change', 'blur'] }],
//   start_date: [{ required: false, type: 'date', trigger: ['change', 'blur'] }],
//   end_date: [{ required: false, type: 'date', trigger: ['change', 'blur'] }],
//   status: [
//     {
//       required: false,
//       type: 'enum',
//       enum: Object.keys(keycapStatuses),
//       trigger: ['change', 'blur'],
//     },
//   ],
//   order_graph: [{ required: false, type: 'url', trigger: ['change', 'blur'] }],
//   order_history: [
//     { required: false, type: 'url', trigger: ['change', 'blur'] },
//   ],
//   description: [{ type: 'string', trigger: ['change', 'blur'] }],
// })

const addKeycap = async () => {
  const slug = isEdit
    ? keycap.value.id
    : slugify(keycap.value.name, { lower: true })

  if (!isEdit) {
    keycap.value.profile_keycap_id = `${keycap.value.profile_id}/${slug}`
  }

  if (ic.value) {
    keycap.value.ic_date = keycap.value.ic_date.toISOString().slice(0, 10)
  } else {
    keycap.value.start_date = keycap.value.dates[0].toISOString().slice(0, 10)
    keycap.value.end_date = keycap.value.dates[1].toISOString().slice(0, 10)
  }

  /**
   * FIXME: maybe we need to change this
   * this is workaroundto handle updating render_img and refresh cdn image
   */
  if (metadata.render_img && metadata.render_img !== keycap.value.render_img) {
    keycap.value.img = ''
  }

  $fetch(`/api/keycaps/${route.params.profile}/${slug}`, {
    method: 'post',
    body: keycap.value,
  })
    .then(() => {
      if (isEdit) {
        toast.add({
          severity: 'success',
          summary: `[${keycap.value.name}] updated successfully!`,
          life: 3000,
        })
      } else {
        toast.add({
          severity: 'success',
          summary: `[${keycap.value.name}] added successfully!`,
          life: 3000,
        })
      }
    })
    .catch((error) => {
      toast.add({ severity: 'error', summary: error.message, life: 3000 })
    })
}
</script>
