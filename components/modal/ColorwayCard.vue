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
      <div v-if="isEditor" @click="$emit('editColorway')">
        <edit-outlined /> Edit
      </div>

      <div @click="copyColorwayCard"><copy-outlined /> Copy</div>

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
              @click="addToCollection(collection)"
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
const { authenticated, collections, isEditor, user } = storeToRefs(userStore)

const { isMobile } = useDevice()

const useCardMeta = computed(() => {
  return isMobile || !colorway.description
})

const addToCollection = (collection) => {
  const clw = {
    colorway_id: colorway.colorway_id,
    name: colorway.name,
    img: colorway.img,
    sculpt_name: colorway.sculpt_name,
    maker_id: colorway.maker_id,
    uid: user.value.uid,
    collection_id: collection.id,
  }

  if (authenticated.value) {
    $fetch(`/api/users/${user.value.uid}/collections/${collection.id}/items`, {
      method: 'post',
      body: clw,
    })
      .then(() => {
        message.success(
          `${clw.name} has been added to [${collection.name}] collection!`,
        )
      })
      .catch((error) => {
        message.error(error.message)
      })
  } else {
    const collectionMap =
      JSON.parse(localStorage.getItem(`Keebtalogue_${collection.id}`)) || []

    collectionMap.push(clw)

    localStorage.setItem(
      `Keebtalogue_${collection.id}`,
      JSON.stringify(collectionMap),
    )

    message.success(
      `${clw.name} has been added to [${collection.name}] collection!`,
    )
  }
}

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
