<template>
  <a-dropdown v-if="collections.length" :trigger="['click']" placement="top">
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

<script setup>
import { message } from 'ant-design-vue'

const { colorway } = defineProps({
  colorway: {
    type: Object,
    default() {
      return {}
    },
  },
})

const userStore = useUserStore()
const { authenticated, collections, user } = storeToRefs(userStore)

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
          `${clw.name} has been added to ${collection.name} collection!`,
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
      `${clw.name} has been added to ${collection.name} collection!`,
    )
  }
}
</script>
