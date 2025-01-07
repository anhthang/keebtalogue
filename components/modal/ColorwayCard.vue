<template>
  <Card
    class="!shadow-none colorway-details-card"
    pt:content:class="text-justify"
  >
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
    <template #subtitle>
      <div class="flex items-center">
        <span v-if="colorway.release">
          <i class="pi pi-calendar" /> {{ colorway.release }}
        </span>
        <Divider
          v-if="colorway.release && (colorway.qty || colorway.price)"
          layout="vertical"
        />
        <span v-if="colorway.qty">
          <i class="pi pi-hashtag" /> {{ colorway.qty }}
        </span>
        <Divider v-if="colorway.qty && colorway.price" layout="vertical" />
        <span v-if="colorway.price">
          <i class="pi pi-money-bill" />
          {{ colorway.currency }} {{ colorway.price }}
        </span>
      </div>
    </template>
    <template #content>
      {{ colorway.description }}
    </template>

    <template v-if="!copying" #footer>
      <div class="flex gap-2">
        <Button
          v-if="editable"
          size="small"
          severity="secondary"
          label="Edit"
          icon="pi pi-pen-to-square"
          fluid
          @click="$emit('editColorway', colorway, true)"
        />

        <Button
          size="small"
          severity="secondary"
          label="Copy Card"
          icon="pi pi-images"
          fluid
          @click="copyColorwayCard"
        />

        <AddToCollectionPopup
          v-if="authenticated"
          :item="colorway"
          label="Add to Collection"
          :fluid="true"
          @on-select="add2Collection"
        />
      </div>
    </template>
  </Card>
</template>

<script setup>
const emit = defineEmits(['editColorway', 'addToCollection'])

const { authenticated, colorway, editable } = defineProps({
  colorway: {
    type: Object,
    default: () => ({}),
  },
  editable: Boolean,
  authenticated: Boolean,
})

const toast = useToast()

const copying = ref(false)
const copyColorwayCard = async () => {
  copying.value = true

  const card = document.getElementsByClassName('colorway-details-card')[0]
  card.classList.add('p-5')

  try {
    await copyScreenshot(card, toast)
  } catch (error) {
    toast.add({ severity: 'error', summary: error.message, life: 3000 })
  }

  card.classList.remove('p-5')
  copying.value = false
}

const add2Collection = (collection, colorway) => {
  emit('addToCollection', collection, colorway)
}
</script>
