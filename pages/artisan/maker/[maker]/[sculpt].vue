<template>
  <Panel
    class="container artisan-container"
    pt:root:class="!border-0 !bg-transparent"
  >
    <template #header>
      <div class="text-2xl leading-8 text-color font-medium">
        {{ sculpt.name }}
      </div>
    </template>

    <div v-if="sculpt.story" class="mb-4 leading-6 text-muted-color">
      {{ sculpt.story }}
    </div>

    <template #icons>
      <div class="flex gap-2">
        <Button
          v-if="isEditor"
          icon="pi pi-pen-to-square"
          label="Edit"
          @click="showEditSculptModal"
        />

        <Button
          v-if="sculpt.href"
          as="a"
          icon="pi pi-link"
          label="Visit"
          :href="sculpt.href"
          target="_blank"
          rel="noopener"
        />

        <Select
          v-model="sort"
          :options="sortOptions"
          option-label="label"
          option-value="value"
        />
      </div>
    </template>

    <div
      class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4"
    >
      <Card
        v-for="(colorway, idx) in colorways"
        :key="colorway.colorway_id"
        class="flex items-center flex-1 overflow-hidden"
        pt:header:class="h-[250px]"
        pt:body:class="text-center"
      >
        <template #header>
          <img
            :alt="colorway.name"
            :src="colorway.img"
            class="h-full object-cover"
            @click="showColorwayCardModal(colorway)"
          />
        </template>
        <template #title>{{ colorway.name || '-' }}</template>

        <template #footer>
          <div class="flex gap-4">
            <Button
              text
              severity="secondary"
              icon="pi pi-pen-to-square"
              @click="toggleEditColorway(colorway)"
            />
            <Button
              text
              severity="secondary"
              icon="pi pi-copy"
              @click="copyColorwayCard(idx)"
            />
            <Button text severity="secondary" icon="pi pi-folder-plus" />
          </div>
        </template>
      </Card>
    </div>

    <Dialog
      v-model:visible="visible.edit"
      modal
      header="Edit Sculpt"
      dismissable-mask
      @ok="updateSculptProfile"
    >
      <modal-sculpt-form ref="sculptForm" :is-edit="true" :metadata="sculpt" />
    </Dialog>

    <Dialog
      v-model:visible="visible.add"
      modal
      :header="
        selectedColorway && selectedColorway.name
          ? `Edit ${colorwayTitle}`
          : 'Add Colorway'
      "
      dismissable-mask
      @ok="newColorwaySubmission"
    >
      <modal-colorway-form ref="colorwayForm" :metadata="selectedColorway" />
    </Dialog>

    <Dialog
      v-model:visible="visible.card"
      modal
      class="colorway-details-card"
      :width="isShowAsMeta ? '512px' : '1024px'"
      :closable="false"
      dismissable-mask
      :footer="null"
      ok-text="Save"
    >
      <modal-colorway-card
        :colorway="selectedColorway"
        @edit-colorway="toggleEditColorway"
        @add-to-collection="addToCollection"
        @copy-colorway-card="copyColorwayCard"
      />
    </Dialog>
  </Panel>
</template>

<script setup>
import orderBy from 'lodash.orderby'

const route = useRoute()
const { isMobile } = useDevice()

const sort = ref('order|desc')
const sortOptions = ref([
  { label: 'Name (A-Z)', value: 'name|asc' },
  { label: 'Name (Z-A)', value: 'name|desc' },
  { label: 'Oldest First', value: 'order|asc' },
  { label: 'Newest First', value: 'order|desc' },
])

const { data: sculpt, refresh } = await useAsyncData(
  `maker:${route.params.maker}:${route.params.sculpt}`,
  () =>
    $fetch(`/api/makers/${route.params.maker}?sculpt=${route.params.sculpt}`),
  {
    watch: () => route.params.sculpt,
    transform: (data) => {
      const sculpt = data.sculpts[route.params.sculpt]

      sculpt.maker_name = data.name

      return sculpt
    },
  },
)

useSeoMeta({
  title: sculpt.value
    ? `${sculpt.value.name} • ${sculpt.value.maker_name}`
    : '',
  description: sculpt.value && sculpt.value.story,
  ogDescription: sculpt.value && sculpt.value.story,
  ogImage: sculpt.value && sculpt.value.img,
  twitterDescription: sculpt.value && sculpt.value.story,
  twitterImage: sculpt.value && sculpt.value.img,
})

watch(
  () => route.query.cid,
  () => {
    const clw = sculpt.value.colorways.find(
      (c) => c.colorway_id === route.query.cid,
    )
    if (clw) {
      showColorwayCardModal(clw)
    }
  },
)

onMounted(() => {
  const clw = sculpt.value.colorways.find(
    (c) => c.colorway_id === route.query.cid,
  )
  if (clw) {
    showColorwayCardModal(clw)
  }
})

const userStore = useUserStore()
const { authenticated, isEditor, user } = storeToRefs(userStore)

const colorways = computed(() => {
  return orderBy(sculpt.value.colorways, ...sort.value.split('|'))
})

const confirmLoading = ref(false)

const visible = ref({
  edit: false,
  add: false,
  card: false,
})

// edit sculpt
const showEditSculptModal = () => {
  visible.value.edit = !visible.value.edit
}

const sculptForm = ref()
const updateSculptProfile = async () => {
  confirmLoading.value = true

  await sculptForm.value.addSculptProfile()

  showEditSculptModal()
  confirmLoading.value = false
  refresh()
}

/**
 * New colorway submission
 * Currently, just add/update colorway description
 */
const showAddColorwayModal = () => {
  visible.value.add = !visible.value.add
}

const colorwayForm = ref()
const newColorwaySubmission = async () => {
  confirmLoading.value = true

  await colorwayForm.value
    .addColorway()
    .then(() => {
      confirmLoading.value = false
      showAddColorwayModal()
      refresh()
    })
    .catch(() => {
      confirmLoading.value = false
    })
}

// show colorway card popup
const selectedColorway = ref({})

const setSelectedColorway = (clw) => {
  selectedColorway.value = clw
  selectedColorway.value.sculpt_name = sculpt.value.name
}

const showColorwayCardModal = (clw) => {
  setSelectedColorway(clw)
  visible.value.card = !visible.value.card
}

const colorwayTitle = computed(() => {
  return `${selectedColorway.value.name} ${sculpt.value.name}`
})

const isShowAsMeta = computed(() => {
  return isMobile || !selectedColorway.value.description
})

// edit colorway
const toggleEditColorway = (clw) => {
  setSelectedColorway(clw)
  showAddColorwayModal()
}

// add to collection
const addToCollection = (collection, colorway) => {
  const clw = {
    colorway_id: colorway.colorway_id,
    name: colorway.name,
    img: colorway.img,
    sculpt_name: colorway.sculpt_name || sculpt.value.name,
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

// copy card
const copyColorwayCard = async (idx) => {
  const elements = idx
    ? document.getElementsByClassName('ant-card-hoverable')
    : document.getElementsByClassName('ant-modal-content')

  const card = elements[idx || 0]

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
.colorway-card,
.colorway-details-card {
  .hide-actions {
    display: none;
  }
}
</style>
