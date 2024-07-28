<template>
  <a-card>
    <template v-if="useCardMeta" #cover>
      <img :alt="colorway.name" :src="colorway.img" />
    </template>

    <a-card-meta v-if="useCardMeta">
      <template #description>
        <colorway-descriptions :colorway="colorway" />
      </template>
    </a-card-meta>

    <a-row v-if="!useCardMeta" :gutter="[16, 16]">
      <a-col :sm="12" :xs="24">
        <a-image :preview="false" :alt="colorway.name" :src="colorway.img" />
      </a-col>
      <a-col :sm="12" :xs="24">
        <colorway-descriptions :colorway="colorway" />
      </a-col>
    </a-row>

    <template #actions>
      <div v-if="isEditor" @click="$emit('editColorway', colorway)">
        <edit-outlined /> Edit
      </div>

      <div @click="$emit('copyColorwayCard')"><copy-outlined /> Copy</div>

      <a-dropdown
        v-if="collections.length"
        :trigger="['click']"
        placement="top"
      >
        <div><folder-add-outlined /> Add to Collection</div>
        <template #overlay>
          <a-menu>
            <a-menu-item
              v-for="collection in collections"
              :key="collection.id"
              :disabled="!collections.length"
              @click="$emit('addToCollection', collection, colorway)"
            >
              {{ collection.name }}
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </template>
  </a-card>
</template>

<script setup>
defineEmits(['editColorway', 'addToCollection', 'copyColorwayCard'])

const { colorway } = defineProps({
  colorway: {
    type: Object,
    default: () => ({}),
  },
})

const userStore = useUserStore()
const { collections, isEditor } = storeToRefs(userStore)

const { isMobile } = useDevice()

const useCardMeta = computed(() => {
  return isMobile || !colorway.description
})
</script>
