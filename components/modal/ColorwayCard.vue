<template>
  <a-card v-if="!hasMeta" :title="colorway.name">
    <template #cover>
      <img :alt="colorway.name" :src="colorway.img" />
    </template>

    <template #actions>
      <div v-if="isEditor" @click="$emit('editColorway')">
        <edit-outlined /> Edit
      </div>
      <div @click="copyColorwayCard"><copy-outlined /> Copy</div>
      <modal-colorway-card-actions :colorway="colorway" />
    </template>
  </a-card>
  <a-card v-else-if="showAsMeta">
    <template #cover>
      <img :alt="colorway.name" :src="colorway.img" />
    </template>

    <a-card-meta>
      <template #description>
        <colorway-descriptions :colorway="colorway" />
      </template>
    </a-card-meta>

    <template #actions>
      <div v-if="isEditor" @click="$emit('editColorway')">
        <edit-outlined /> Edit
      </div>
      <div @click="copyColorwayCard"><copy-outlined /> Copy</div>
      <modal-colorway-card-actions :colorway="colorway" />
    </template>
  </a-card>
  <a-card v-else :title="colorway.name">
    <template #extra>
      <a-tag v-if="colorway.giveaway" color="goldenrod">
        <template #icon> <gift-filled /> Giveaway </template>
      </a-tag>

      <a-tag v-if="colorway.commissioned" color="palevioletred">
        <template #icon> <bg-colors-outlined /> Commissioned </template>
      </a-tag>
    </template>

    <a-row :gutter="[16, 16]">
      <a-col :sm="12" :xs="24">
        <a-image :preview="false" :alt="colorway.name" :src="colorway.img" />
      </a-col>
      <a-col :sm="12" :xs="24">
        <colorway-descriptions :colorway="colorway" />
      </a-col>
    </a-row>

    <template #actions>
      <div v-if="isEditor" @click="$emit('editColorway')">
        <edit-outlined /> Edit
      </div>
      <div @click="copyColorwayCard"><copy-outlined /> Copy</div>
      <modal-colorway-card-actions :colorway="colorway" />
    </template>
  </a-card>
</template>

<script setup>
defineEmits(['editColorway'])

const { colorway } = defineProps({
  colorway: {
    type: Object,
    default() {
      return {}
    },
  },
})

const userStore = useUserStore()
const { isEditor } = storeToRefs(userStore)

const { isMobile } = useDevice()

const hasMeta = computed(() => {
  return colorway.release || colorway.qty
})

const showAsMeta = computed(() => {
  return isMobile || !colorway.description
})

const copyColorwayCard = async () => {
  const card = document.getElementsByClassName('ant-modal-content')[0]

  const cardActions = card.getElementsByClassName('ant-card-actions')[0]
  cardActions.classList.add('hide-actions')

  try {
    await copyScreenshot(card)
  } catch (error) {
    message.error(error.message)
  }

  cardActions.classList.remove('hide-actions')
}
</script>

<style>
.colorway-card {
  .hide-actions {
    display: none;
  }
}
</style>
