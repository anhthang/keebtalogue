<template>
  <div class="flex flex-col gap-6">
    <div class="flex flex-col gap-2">
      <label for="sculpt_name">Name</label>
      <IconField>
        <InputIcon class="pi pi-pencil" />
        <InputText
          id="sculpt_name"
          v-model.trim="sculpt.name"
          type="text"
          fluid
        />
      </IconField>
    </div>
    <div class="grid grid-cols-2 gap-2">
      <div class="flex flex-col gap-2">
        <label for="sculpt_release">Release</label>
        <IconField>
          <InputIcon class="pi pi-calendar" />
          <InputText
            id="sculpt_release"
            v-model.trim="sculpt.release"
            type="text"
            fluid
          />
        </IconField>
      </div>
      <div class="flex flex-col gap-2">
        <label for="sculpt_profile">Profile</label>
        <Select
          id="sculpt_profile"
          v-model="sculpt.profile"
          :options="['sculpted', 'blank']"
        />
      </div>
    </div>
    <div class="grid grid-cols-2 gap-2">
      <div class="flex flex-col gap-2">
        <label for="sculpt_cast">Cast</label>
        <Select
          id="sculpt_cast"
          v-model="sculpt.cast"
          :options="['resin', 'mixed']"
        />
      </div>
      <div class="flex flex-col gap-2">
        <label for="sculpt_design">Design</label>
        <Select
          id="sculpt_design"
          v-model="sculpt.design"
          :options="['physical', 'digital', 'hybrid']"
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
          type="url"
          fluid
        />
      </IconField>
    </div>
    <div class="flex flex-col gap-2">
      <label for="sculpt_story">Storyline</label>
      <Textarea
        id="sculpt_story"
        v-model.trim="sculpt.story"
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

const onSubmit = () => {
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
