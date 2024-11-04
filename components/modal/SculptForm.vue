<template>
  <Form
    v-slot="$form"
    :initial-values="sculpt"
    :resolver
    class="flex flex-col gap-6"
    @submit="onSubmit"
  >
    <div class="flex flex-col gap-2">
      <label for="sculpt_name">Name</label>
      <IconField>
        <InputIcon class="pi pi-pencil" />
        <InputText
          id="sculpt_name"
          v-model.trim="sculpt.name"
          name="name"
          type="text"
          fluid
        />
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

    <div class="grid grid-cols-2 gap-2">
      <div class="flex flex-col gap-2">
        <label for="sculpt_release">Release</label>
        <IconField>
          <InputIcon class="pi pi-calendar" />
          <InputText
            id="sculpt_release"
            v-model.trim="sculpt.release"
            name="release"
            type="text"
            fluid
          />
        </IconField>
        <Message
          v-if="$form.release?.invalid"
          severity="error"
          size="small"
          variant="simple"
        >
          {{ $form.release.error.message }}
        </Message>
      </div>
      <div class="flex flex-col gap-2">
        <label for="sculpt_profile">Profile</label>
        <Select
          id="sculpt_profile"
          v-model="sculpt.profile"
          name="profile"
          :options="profiles"
        />
      </div>
    </div>

    <div class="grid grid-cols-2 gap-2">
      <div class="flex flex-col gap-2">
        <label for="sculpt_cast">Cast</label>
        <Select
          id="sculpt_cast"
          v-model="sculpt.cast"
          name="cast"
          :options="casts"
        />
      </div>
      <div class="flex flex-col gap-2">
        <label for="sculpt_design">Design</label>
        <Select
          id="sculpt_design"
          v-model="sculpt.design"
          name="design"
          :options="designs"
        />
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <label for="sculpt_url">URL</label>
      <IconField>
        <InputIcon class="pi pi-globe" />
        <InputText
          id="sculpt_url"
          v-model.trim="sculpt.href"
          name="href"
          type="url"
          fluid
        />
      </IconField>
      <Message
        v-if="$form.href?.invalid"
        severity="error"
        size="small"
        variant="simple"
      >
        {{ $form.href.error.message }}
      </Message>
    </div>

    <div class="flex flex-col gap-2">
      <label for="sculpt_story">Storyline</label>
      <Textarea
        id="sculpt_story"
        v-model.trim="sculpt.story"
        name="story"
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
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { z } from 'zod'

const emit = defineEmits(['onSuccess'])

const { metadata, isEdit } = defineProps({
  metadata: {
    type: Object,
    default: () => ({}),
  },
  isEdit: Boolean,
})

const toast = useToast()

const route = useRoute()
const sculpt = ref({
  maker_id: route.params.maker,
  sculpt_id: route.params.sculpt,
})

onBeforeMount(() => {
  const { colorways, ...rest } = metadata

  Object.assign(sculpt.value, rest)
})

const profiles = ['sculpted', 'blank']
const casts = ['resin', 'mixed']
const designs = ['physical', 'digital', 'hybrid']

const resolver = ref(
  zodResolver(
    z.object({
      name: z.string().min(1),
      release: z.string().nullish(),
      profile: z.enum(profiles).nullish(),
      cast: z.enum(casts).nullish(),
      design: z.enum(designs).nullish(),
      href: z.string().url().nullish().or(z.string().min(0).max(0)),
      // story: z.string(),
    }),
  ),
)

const onSubmit = async ({ valid }) => {
  if (!valid) return

  $fetch(`/api/makers/${route.params.maker}/sculpts/${route.params.sculpt}`, {
    method: 'post',
    body: sculpt.value,
  })
    .then(() => {
      if (isEdit) {
        toast.add({
          severity: 'success',
          summary: 'Sculpt updated successfully!',
          life: 3000,
        })
        emit('onSuccess')
      } else {
        toast.add({
          severity: 'success',
          summary: 'New sculpt added successfully!',
          life: 3000,
        })
        emit('onSuccess')
      }
    })
    .catch((error) => {
      toast.add({ severity: 'error', summary: error.message, life: 3000 })
    })
}
</script>
