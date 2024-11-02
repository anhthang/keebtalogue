<template>
  <Form
    v-slot="$form"
    :initial-values="keycap"
    :resolver
    class="flex flex-col gap-6"
    @submit="onSubmit"
  >
    <div class="grid grid-cols-2 gap-2">
      <div class="flex flex-col gap-2">
        <label for="keycap_name">Name</label>
        <IconField>
          <InputIcon class="pi pi-pencil" />

          <InputText id="keycap_name" name="name" type="text" fluid />
        </IconField>
        <Message
          v-if="$form.name?.invalid"
          severity="error"
          size="small"
          variant="simple"
        >
          {{ $form.name.error.message }}
        </Message>
      </div>
      <div class="flex flex-col gap-2">
        <label for="keycap_designer">Designer</label>
        <IconField>
          <InputIcon class="pi pi-user" />
          <InputText id="keycap_designer" name="designer" type="text" fluid />
        </IconField>
        <Message
          v-if="$form.designer?.invalid"
          severity="error"
          size="small"
          variant="simple"
        >
          {{ $form.designer.error.message }}
        </Message>
      </div>
    </div>
    <div class="grid grid-cols-2 gap-2">
      <div class="flex flex-col gap-2">
        <label for="keycap_profile">Profile</label>
        <Select
          id="keycap_profile"
          name="profile_id"
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
        <IconField>
          <InputIcon class="pi pi-objects-column" />
          <InputText id="keycap_sculpt" name="sculpt" type="text" fluid />
        </IconField>
        <Message
          v-if="$form.sculpt?.invalid"
          severity="error"
          size="small"
          variant="simple"
        >
          {{ $form.sculpt.error.message }}
        </Message>
      </div>
    </div>
    <div class="flex flex-col gap-2">
      <label for="keycap_url">URL</label>
      <IconField>
        <InputIcon class="pi pi-image" />
        <InputText id="keycap_url" name="url" type="url" fluid />
      </IconField>
      <Message
        v-if="$form.url?.invalid"
        severity="error"
        size="small"
        variant="simple"
      >
        {{ $form.url.error.message }}
      </Message>
    </div>
    <div class="flex flex-col gap-2">
      <label for="keycap_render">Render</label>
      <IconField>
        <InputIcon class="pi pi-image" />
        <InputText id="keycap_render" name="render_img" type="url" fluid />
      </IconField>
      <Message
        v-if="$form.render_img?.invalid"
        severity="error"
        size="small"
        variant="simple"
      >
        {{ $form.render_img.error.message }}
      </Message>
    </div>
    <div class="flex flex-col gap-2">
      <label for="keycap_cover">Cover</label>
      <IconField>
        <InputIcon class="pi pi-image" />
        <InputText id="keycap_cover" name="cover_img" type="url" fluid />
      </IconField>
      <Message
        v-if="$form.cover_img?.invalid"
        severity="error"
        size="small"
        variant="simple"
      >
        {{ $form.cover_img.error.message }}
      </Message>
    </div>
    <div class="grid grid-cols-2 gap-2">
      <div class="flex flex-col gap-2">
        <label for="keycap_status">Status</label>
        <Select
          id="keycap_status"
          name="status"
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
      <IconField>
        <InputIcon class="pi pi-chart-bar" />
        <InputText id="keycap_graph" name="order_graph" type="url" fluid />
      </IconField>
      <Message
        v-if="$form.order_graph?.invalid"
        severity="error"
        size="small"
        variant="simple"
      >
        {{ $form.order_graph.error.message }}
      </Message>
    </div>
    <div class="flex flex-col gap-2">
      <label for="keycap_history">Order History</label>
      <IconField>
        <InputIcon class="pi pi-chart-line" />
        <InputText id="keycap_history" name="order_history" type="url" fluid />
      </IconField>
      <Message
        v-if="$form.order_history?.invalid"
        severity="error"
        size="small"
        variant="simple"
      >
        {{ $form.order_history.error.message }}
      </Message>
    </div>
    <div class="flex flex-col gap-2">
      <label for="keycap_description">Description</label>
      <Textarea
        id="keycap_description"
        name="description"
        :rows="5"
        auto-resize
      />
    </div>
    <div class="flex flex-col gap-2">
      <Button label="Save" type="submit" :disabled="!$form.valid" />
    </div>

    <Toast />
  </Form>
</template>

<script setup>
import { zodResolver } from '@primevue/forms/resolvers'
import slugify from 'slugify'
import { z } from 'zod'

const emit = defineEmits(['onSuccess'])

const { metadata, isEdit } = defineProps({
  metadata: {
    type: Object,
    default: () => ({}),
  },
  isEdit: Boolean,
})

const route = useRoute()
const toast = useToast()

const keycap = ref({
  name: '',
  url: '',
  render_img: '',
  dates: [],
})

onBeforeMount(() => {
  const { page, size, ...rest } = metadata
  Object.assign(keycap.value, rest)

  if (rest.ic_date) {
    keycap.value.ic_date = new Date(rest.ic_date)
  }
  if (rest.start_date) {
    keycap.value.dates[0] = new Date(rest.start_date)
  }
  if (rest.end_date) {
    keycap.value.dates[1] = new Date(rest.end_date)
  }
})

const ic = computed(() => keycap.value.status === 'Interest Check')

const resolver = ref(
  zodResolver(
    z.object({
      name: z.string().min(1),
      designer: z.string(),
      sculpt: z.string(),
      profile_id: z.enum(Object.keys(manufacturers)),
      url: z.string().url().nullish().or(z.string().min(0).max(0)),
      render_img: z.string().url().nullish().or(z.string().min(0).max(0)),
      cover_img: z.string().url().nullish().or(z.string().min(0).max(0)),
      ic_date: z.date(),
      start_date: z.date(),
      end_date: z.date(),
      status: z.enum(Object.keys(keycapStatuses)).nullish(),
      order_graph: z.string().url().nullish().or(z.string().min(0).max(0)),
      order_history: z.string().url().nullish().or(z.string().min(0).max(0)),
      description: z.string(),
    }),
  ),
)

const onSubmit = async ({ valid }) => {
  if (!valid) return

  const slug = isEdit
    ? keycap.value.id
    : slugify(keycap.value.name, { lower: true })

  if (!isEdit) {
    keycap.value.profile_keycap_id = `${keycap.value.profile_id}/${slug}`
  }

  if (keycap.value.ic_date) {
    keycap.value.ic_date = toISODate(keycap.value.ic_date)
  }
  if (keycap.value.dates[0]) {
    keycap.value.start_date = toISODate(keycap.value.dates[0])
  }
  if (keycap.value.dates[1]) {
    keycap.value.end_date = toISODate(keycap.value.dates[1])
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
        emit('onSuccess', true)
      } else {
        toast.add({
          severity: 'success',
          summary: `[${keycap.value.name}] added successfully!`,
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
