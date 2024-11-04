<template>
  <Panel
    :header="sculpt.name"
    pt:root:class="!border-0 !bg-transparent"
    pt:title:class="flex items-center gap-4 font-medium text-3xl"
  >
    <div v-if="sculpt.story" class="mb-4 leading-6 text-muted-color">
      <p
        v-for="(line, idx) in sculpt.story.split('\n')"
        :key="idx"
        class="mb-2"
      >
        {{ line }}
      </p>
    </div>

    <template #icons>
      <div class="flex gap-2">
        <Button
          v-if="isEditor"
          icon="pi pi-pen-to-square"
          label="Edit"
          @click="toggleEditSculpt"
        />

        <Button
          v-if="sculpt.href"
          as="a"
          icon="pi pi-external-link"
          label="Website"
          :href="sculpt.href"
          target="_blank"
          rel="noopener"
        />

        <SplitButton
          :label="sortItem.label"
          :icon="sortItem.icon"
          :model="sortOptions"
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
        :pt="{
          header: 'w-full h-44 md:h-60',
          body: 'items-center',
          caption: 'flex items-center',
          title: 'w-40 text-center truncate',
        }"
      >
        <template #header>
          <img
            loading="lazy"
            :alt="colorway.name"
            :src="colorway.img"
            class="w-full h-full object-cover"
            @click="toggleColorwayCard(colorway)"
          />
        </template>
        <template #title>{{ colorway.name || '-' }}</template>

        <template #footer>
          <div class="flex gap-4">
            <Button
              v-if="isEditor"
              text
              size="small"
              severity="secondary"
              icon="pi pi-pen-to-square"
              @click="toggleEditColorway(colorway)"
            />

            <Button
              text
              size="small"
              severity="secondary"
              icon="pi pi-window-maximize"
              @click="toggleColorwayCard(colorway)"
            />

            <Button
              text
              size="small"
              severity="secondary"
              icon="pi pi-folder-plus"
              aria-haspopup="true"
              aria-controls="overlay_menu"
              @click="(e) => toggle(e, idx)"
            />
            <Menu
              id="overlay_menu"
              ref="add2collection"
              :popup="true"
              :model="[
                {
                  label: 'Select Collection',
                  items: collections.map((c) => ({
                    label: c.name,
                    command: () => addToCollection(c, colorway),
                  })),
                },
              ]"
            />
          </div>
        </template>
      </Card>
    </div>

    <Dialog
      v-model:visible="visible.edit"
      modal
      header="Edit Sculpt"
      dismissable-mask
      class="w-[36rem]"
    >
      <ModalSculptForm
        :is-edit="true"
        :metadata="sculpt"
        @on-success="toggleEditSculpt"
      />
    </Dialog>

    <Dialog
      v-model:visible="visible.add"
      modal
      :header="
        selectedColorway && selectedColorway.name
          ? `Edit ${colorwayTitle}`
          : 'Add Colorway'
      "
      class="w-[36rem]"
      dismissable-mask
    >
      <ModalColorwayForm
        :metadata="selectedColorway"
        @on-success="toggleAddColorway"
      />
    </Dialog>

    <Dialog
      v-model:visible="visible.card"
      modal
      class="colorway-details-card max-w-xl"
      :closable="false"
      dismissable-mask
    >
      <ModalColorwayCard
        :colorway="selectedColorway"
        @edit-colorway="toggleEditColorway"
        @add-to-collection="addToCollection"
      />
    </Dialog>

    <Toast />
  </Panel>
</template>

<script setup>
import orderBy from 'lodash.orderby'

const toast = useToast()

const add2collection = ref()
const toggle = (event, idx) => {
  add2collection.value[idx].toggle(event)
}

const route = useRoute()

const sort = ref('order|desc')
const sortItem = ref({
  label: 'Newest First',
  icon: 'pi pi-sort-numeric-down-alt',
})
const sortOptions = [
  {
    label: 'Name (A-Z)',
    icon: 'pi pi-sort-alpha-down',
    command: ({ item }) => {
      sort.value = 'name|asc'
      sortItem.value = item
    },
  },
  {
    label: 'Name (Z-A)',
    icon: 'pi pi-sort-alpha-down-alt',
    command: ({ item }) => {
      sort.value = 'name|desc'
      sortItem.value = item
    },
  },
  {
    label: 'Oldest First',
    icon: 'pi pi-sort-numeric-down',
    command: ({ item }) => {
      sort.value = 'order|asc'
      sortItem.value = item
    },
  },
  {
    label: 'Newest First',
    icon: 'pi pi-sort-numeric-down-alt',
    command: ({ item }) => {
      sort.value = 'order|desc'
      sortItem.value = item
    },
  },
]

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
      toggleColorwayCard(clw)
    }
  },
)

onMounted(() => {
  const clw = sculpt.value.colorways.find(
    (c) => c.colorway_id === route.query.cid,
  )
  if (clw) {
    toggleColorwayCard(clw)
  }
})

const userStore = useUserStore()
const { authenticated, collections, isEditor, user } = storeToRefs(userStore)

const colorways = computed(() => {
  return orderBy(sculpt.value.colorways, ...sort.value.split('|'))
})

const visible = ref({
  edit: false,
  add: false,
  card: false,
})

// edit sculpt
const toggleEditSculpt = (shouldRefresh) => {
  visible.value.edit = !visible.value.edit
  if (shouldRefresh) {
    refresh()
  }
}

/**
 * New colorway submission
 * Currently, just add/update colorway description
 */
const toggleAddColorway = (clw, shouldRefresh) => {
  visible.value.add = !visible.value.add
  if (shouldRefresh) {
    refresh()
  }
}

// show colorway card popup
const selectedColorway = ref({})
const setSelectedColorway = (clw) => {
  selectedColorway.value = clw
  selectedColorway.value.sculpt_name = sculpt.value.name
}

const toggleColorwayCard = (clw) => {
  setSelectedColorway(clw)
  visible.value.card = !visible.value.card
}

const colorwayTitle = computed(() => {
  return `${selectedColorway.value.name} ${sculpt.value.name}`
})

// edit colorway
const toggleEditColorway = (clw, shouldRefresh) => {
  setSelectedColorway(clw)
  toggleAddColorway(shouldRefresh)
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
        toast.add({
          severity: 'success',
          summary: `${clw.name} has been added to [${collection.name}] collection!`,
          life: 3000,
        })
      })
      .catch((error) => {
        toast.add({ severity: 'error', summary: error.message, life: 3000 })
      })
  } else {
    const collectionMap =
      JSON.parse(localStorage.getItem(`Keebtalogue_${collection.id}`)) || []

    collectionMap.push(clw)

    localStorage.setItem(
      `Keebtalogue_${collection.id}`,
      JSON.stringify(collectionMap),
    )

    toast.add({
      severity: 'success',
      summary: `${clw.name} has been added to [${collection.name}] collection!`,
      life: 3000,
    })
  }
}
</script>
