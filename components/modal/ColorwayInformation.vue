<template>
  <a-card :title="title">
    <a-row v-if="!$device.isMobile" :gutter="[16, 16]">
      <a-col :sm="12" :xs="24">
        <a-image :preview="false" :alt="colorway.name" :src="colorway.img" />
      </a-col>
      <a-col :sm="12" :xs="24">
        <a-descriptions title="Information" :column="1" size="small">
          <template #extra>
            <a-tag v-if="colorway.giveaway" color="orange">
              <template #icon> <gift-filled /> Giveaway </template>
            </a-tag>

            <a-tag v-if="colorway.commissioned" color="palevioletred">
              <template #icon> <bg-colors-outlined /> Commissioned </template>
            </a-tag>
          </template>
          <a-descriptions-item label="Released">
            {{ colorway.release }}
          </a-descriptions-item>
          <a-descriptions-item label="Quantity">
            {{ colorway.qty }}
          </a-descriptions-item>
          <a-descriptions-item
            v-if="authenticated && colorway.price"
            label="Price"
          >
            {{ colorway.currency }} {{ colorway.price }}
          </a-descriptions-item>
          <a-descriptions-item
            v-if="authenticated && colorway.sale_type"
            label="Sale Type"
          >
            {{ colorway.sale_type }}
          </a-descriptions-item>
        </a-descriptions>

        <a-typography-paragraph
          v-for="(line, idx) in descriptionLines"
          :key="idx"
        >
          {{ line }}
        </a-typography-paragraph>
      </a-col>
    </a-row>

    <template v-if="$device.isMobile" #cover>
      <img :alt="colorway.name" :src="colorway.img" />
    </template>

    <a-card-meta v-if="$device.isMobile">
      <template #description>
        <a-descriptions title="Information" :column="1" size="small">
          <template #extra>
            <a-tag v-if="colorway.giveaway" color="orange">
              <template #icon> <gift-filled /> Giveaway </template>
            </a-tag>

            <a-tag v-if="colorway.commissioned" color="palevioletred">
              <template #icon> <bg-colors-outlined /> Commissioned </template>
            </a-tag>
          </template>
          <a-descriptions-item label="Released">
            {{ colorway.release }}
          </a-descriptions-item>
          <a-descriptions-item label="Quantity">
            {{ colorway.qty }}
          </a-descriptions-item>
          <a-descriptions-item
            v-if="authenticated && colorway.price"
            label="Price"
          >
            {{ colorway.currency }} {{ colorway.price }}
          </a-descriptions-item>
          <a-descriptions-item
            v-if="authenticated && colorway.sale_type"
            label="Sale Type"
          >
            {{ colorway.sale_type }}
          </a-descriptions-item>
        </a-descriptions>

        <a-typography-paragraph
          v-for="(line, idx) in descriptionLines"
          :key="idx"
        >
          {{ line }}
        </a-typography-paragraph>
      </template>
    </a-card-meta>

    <template #actions>
      <div v-if="isEditor" @click="toggleEditColorway">
        <edit-outlined /> Edit
      </div>

      <a-dropdown
        v-if="collections.length"
        :trigger="['click']"
        placement="top"
      >
        <div><save-outlined /> Add to Collection</div>
        <template #overlay>
          <a-menu>
            <a-menu-item
              v-for="collection in collections"
              :key="collection.id"
              :disabled="!collections.length"
              @click="addToCollection(collection, colorway)"
            >
              {{ collection.name }}
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </template>
  </a-card>

  <a-modal
    v-model:open="showEditColorwayModal"
    :title="`Edit ${colorway.name}`"
    destroy-on-close
    :confirm-loading="confirmLoading"
    @ok="onEditColorway"
  >
    <modal-colorway-form ref="colorwayForm" :metadata="colorway" />
  </a-modal>

  <!-- <nuxt-link :to="`/keycap/${colorway.keycap.slug}`">
      <a-tag :key="colorway.keycap.id" :color="colorway.keycap.base">
        {{ colorway.keycap.name }}
      </a-tag>
    </nuxt-link> -->
</template>

<script setup>
import { message } from 'ant-design-vue'

const { metadata, sculptName } = defineProps({
  metadata: {
    type: Object,
    default() {
      return {}
    },
  },
  sculptName: {
    type: String,
    default: '',
  },
})

const userStore = useUserStore()
const { authenticated, isEditor, collections, user } = storeToRefs(userStore)

const colorway = ref({})

onBeforeMount(() => {
  if (metadata && Object.keys(metadata).length) {
    colorway.value = { ...metadata }
  }
})

const descriptionLines = computed(() => {
  return colorway.value.description
    ? colorway.value.description.split('\n')
    : []
})

const title = computed(() => `${colorway.value.name} ${sculptName}`)

const addToCollection = (collection, colorway) => {
  const clw = {
    colorway_id: colorway.colorway_id,
    name: colorway.name,
    img: colorway.img,
    sculpt_name: sculptName,
    maker_id: route.params.maker,
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

const showEditColorwayModal = ref(false)
const toggleEditColorway = () => {
  showEditColorwayModal.value = !showEditColorwayModal.value
}

const colorwayForm = ref()
const confirmLoading = ref(false)
const onEditColorway = async () => {
  confirmLoading.value = true

  await colorwayForm.value.addColorway()
  toggleEditColorway()

  confirmLoading.value = false
  refresh()
}
</script>
