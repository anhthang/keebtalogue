<template>
  <Card class="!shadow-none">
    <template #header>
      <img
        :alt="colorway.name"
        :src="colorway.img"
        class="h-full object-cover"
      />
    </template>
    <template #title>
      <div class="flex justify-between items-center">
        <div class="mt-0 font-semibold text-xl">
          {{ colorway.name }}
        </div>
        <Tag
          v-if="colorway.commissioned"
          icon="pi pi-palette"
          value="Commissioned"
        />
        <Tag v-if="colorway.giveaway" icon="pi pi-gift" value="Giveaway" />
      </div>
    </template>

    <template #content>
      {{ colorway.description }}
    </template>

    <template v-if="!copying" #footer>
      <div class="flex gap-2">
        <Button
          v-if="isEditor"
          size="small"
          severity="secondary"
          label="Edit"
          icon="pi pi-pen-to-square"
          @click="$emit('editColorway', colorway)"
        />

        <Button
          size="small"
          severity="secondary"
          label="Copy Card"
          icon="pi pi-copy"
          @click="copyColorwayCard"
        />

        <Button
          size="small"
          severity="secondary"
          label="Add to Collection"
          icon="pi pi-folder-plus"
          aria-haspopup="true"
          aria-controls="overlay_menu"
          @click="toggle"
        />
        <Menu
          id="overlay_menu"
          ref="add2collection"
          :popup="true"
          :model="[
            {
              label: 'Select Collection',
              items: collections.map((collection) => ({
                label: collection.name,
                command: () => {
                  $emit('addToCollection', collection, colorway)
                },
              })),
            },
          ]"
        />
      </div>
    </template>
  </Card>
</template>

<script setup>
defineEmits(['editColorway', 'addToCollection'])

const { colorway } = defineProps({
  colorway: {
    type: Object,
    default: () => ({}),
  },
})

const userStore = useUserStore()
const { collections, isEditor } = storeToRefs(userStore)

const toast = useToast()

const add2collection = ref()
const toggle = (event) => {
  add2collection.value.toggle(event)
}

const copying = ref(false)
const copyColorwayCard = async () => {
  copying.value = true
  const card = document.getElementsByClassName('colorway-details-card')[0]

  try {
    await copyScreenshot(card, toast)
  } catch (error) {
    toast.add({ severity: 'error', summary: error.message, life: 3000 })
  }

  copying.value = false
}
</script>
