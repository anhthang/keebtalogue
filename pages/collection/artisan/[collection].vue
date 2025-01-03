<template>
  <div>
    <PanelBreadcrumb :breadcrumbs="breadcrumbs" />

    <Panel
      :header="data?.name || 'Collection'"
      pt:root:class="!border-0 !bg-transparent"
      pt:title:class="flex items-center gap-4 font-medium text-3xl"
    >
      <template #icons>
        <div v-if="$device.isDesktopOrTablet" class="flex gap-2">
          <Button
            v-if="shareable"
            icon="pi pi-link"
            label="Copy URL"
            severity="secondary"
            @click="copyShareUrl"
          />

          <SplitButton
            :icon="sortItem.icon"
            :label="sortItem.label"
            severity="secondary"
            :model="sortOptions"
          />

          <Button
            v-if="authenticated"
            icon="pi pi-pen-to-square"
            label="Edit"
            severity="secondary"
            @click="toggleShowEdit"
          />

          <Button
            v-if="user.email_verified"
            icon="pi pi-trash"
            label="Delete"
            severity="danger"
            @click="deleteCollection"
          />
        </div>
        <Button
          v-else
          aria-haspopup="true"
          aria-controls="overlay_menu"
          icon="pi pi-ellipsis-v"
          severity="secondary"
          @click="toggleActions"
        >
        </Button>
        <Menu id="overlay_menu" ref="menu" :model="mobile" :popup="true" />
      </template>

      <DataView
        :value="sortedCollections"
        layout="grid"
        paginator
        :rows="60"
        :total-records="sortedCollections.length"
        :always-show-paginator="false"
        :pt="{
          content: '!bg-transparent',
          pcPaginator: {
            paginatorContainer: '!border-0 pt-4',
            root: '!bg-transparent',
          },
        }"
      >
        <template #grid="{ items }">
          <div
            class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6 gap-4"
          >
            <Card
              v-for="colorway in items"
              :key="colorway.id"
              class="flex items-center flex-1 overflow-hidden"
              :pt="{
                header: 'h-44 md:h-60',
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
                  class="h-full object-cover"
                />
              </template>
              <template #title>{{ colorway.artisan.name || '-' }}</template>
              <template #subtitle>{{ colorway.artisan?.sculpt.name }}</template>

              <template #footer>
                <div class="flex gap-2">
                  <Button
                    v-if="authenticated && trading"
                    v-tooltip.top="`Mark as ${changeTo(colorway.exchange)}`"
                    size="small"
                    text
                    :severity="colorway.exchange ? 'secondary' : 'success'"
                    :icon="
                      colorway.exchange ? 'pi pi-circle' : 'pi pi-check-circle'
                    "
                    @click="changeExchangeStatus(colorway)"
                  />
                  <Button
                    v-tooltip.top="'Remove'"
                    size="small"
                    text
                    severity="danger"
                    icon="pi pi-trash"
                    @click="removeCap(colorway)"
                  />
                </div>
              </template>
            </Card>
          </div>
        </template>
      </DataView>

      <Dialog
        v-model:visible="visible"
        modal
        header="Edit Collection"
        dismissable-mask
        class="w-[36rem]"
      >
        <ModalCollectionForm
          :metadata="data"
          :uid="user.uid"
          :is-edit="true"
          @on-success="toggleShowEdit"
        />
      </Dialog>
    </Panel>

    <ConfirmDialog />
    <Toast />
  </div>
</template>

<script setup>
import sortBy from 'lodash.sortby'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'

const breadcrumbs = computed(() => {
  return [
    {
      icon: 'pi pi-home',
      route: '/',
    },
    {
      label: 'My Collections',
      route: `/collection`,
    },
  ]
})

const confirm = useConfirm()
const toast = useToast()

const sort = ref('sculpt_name')
const sortItem = ref({ label: 'Sort by Sculpt', icon: 'pi pi-sort-alt' })
const sortOptions = computed(() => [
  {
    label: 'Sort by Sculpt',
    icon: 'pi pi-sort-alt',
    class: sort.value === 'sculpt_name' && activePopMenu,
    command: ({ item }) => {
      sort.value = 'sculpt_name'
      sortItem.value = item
    },
  },
  {
    label: 'Sort by Colorway',
    icon: 'pi pi-sort-alpha-down',
    class: sort.value === 'name' && activePopMenu,
    command: ({ item }) => {
      sort.value = 'name'
      sortItem.value = item
    },
  },
])

const config = useRuntimeConfig()

const userStore = useUserStore()
const { authenticated, collections, user } = storeToRefs(userStore)

const route = useRoute()
const router = useRouter()

const { data, refresh } = await useAsyncData(() => {
  if (authenticated.value) {
    return $fetch(
      `/api/users/${user.value.uid}/collections/${route.params.collection}`,
    )
  } else {
    return $fetch(`/api/collections/${route.params.collection}`)
  }
})

const shareable = data.value?.published && data.value?.type === 'shareable'
const trading = [
  'to_buy',
  'for_sale',
  'personal_buy',
  'personal_sell',
].includes(data.value?.type)

useSeoMeta({
  title: data.value?.name ? `${data.value.name} • Collection` : 'Collection',
})

watchEffect(() => route.params.collection, refresh())

const sortedCollections = computed(() => {
  return sortBy(data.value?.items || [], ['maker_id', sort.value])
})

const menu = ref()
const toggleActions = (event) => {
  menu.value.toggle(event)
}

const mobile = computed(() => {
  return [
    {
      label: 'Editing',
      visible: authenticated,
      items: [
        {
          label: 'Copy URL',
          icon: 'pi pi-link',
          visible: shareable,
          command: copyShareUrl,
        },
        {
          label: 'Edit',
          icon: 'pi pi-pen-to-square',
          visible: authenticated.value,
          command: toggleShowEdit,
        },
        {
          label: 'Delete',
          icon: 'pi pi-trash',
          visible: user.value.email_verified,
          command: deleteCollection,
        },
      ],
    },
    {
      label: 'Sorting',
      items: sortOptions.value,
    },
  ]
})

const changeTo = (exchange) => {
  if (data.value.type === 'to_buy' || data.value.type === 'personal_buy') {
    return exchange ? 'found' : 'wanted'
  }

  return exchange ? 'sold' : 'available'
}

const changeExchangeStatus = (clw) => {
  const title = colorwayTitle(clw)
  const status = changeTo(clw.exchange)

  confirm.require({
    header: `Mark ${title} as...`,
    message: `Are you sure you want to mark this item as ${status}?`,
    rejectProps: {
      size: 'small',
      severity: 'secondary',
    },
    acceptProps: {
      size: 'small',
    },
    accept: () => {
      $fetch(
        `/api/users/${user.value.uid}/collections/${route.params.collection}/items/${clw.id}`,
        { method: 'post', body: { exchange: !clw.exchange } },
      )
        .then(() => {
          refresh()
          toast.add({
            severity: 'success',
            summary: `${title} has been successfully marked as ${status}.`,
            life: 3000,
          })
        })
        .catch((error) => {
          toast.add({ severity: 'error', summary: error.message, life: 3000 })
        })
    },
  })
}

const removeCap = (clw) => {
  confirm.require({
    header: 'Confirm to remove artisan',
    message: `Are you sure you want to remove ${colorwayTitle(clw)}?`,
    rejectProps: {
      size: 'small',
      label: 'Cancel',
      severity: 'secondary',
    },
    acceptProps: {
      size: 'small',
      label: 'Remove',
      severity: 'danger',
    },
    accept: () => {
      $fetch(
        `/api/users/${user.value.uid}/collections/${route.params.collection}/items/${clw.id}`,
        { method: 'delete' },
      )
        .then(() => {
          refresh()
          toast.add({
            severity: 'success',
            summary: `${colorwayTitle(clw)} was removed.`,
            life: 3000,
          })
        })
        .catch((error) => {
          toast.add({ severity: 'error', summary: error.message, life: 3000 })
        })
    },
  })
}

const deleteCollection = () => {
  confirm.require({
    header: 'Confirm to delete collection',
    message: 'Are you sure you want to continue? This action cannot be undone.',
    rejectProps: {
      size: 'small',
      label: 'Cancel',
      severity: 'secondary',
    },
    acceptProps: {
      size: 'small',
      label: 'Delete',
      severity: 'danger',
    },
    accept: () => {
      $fetch(`/api/users/${data.value.uid}/collections/${data.value.id}`, {
        method: 'delete',
      })
        .then(() => {
          collections.value = collections.value.filter(
            (c) => c.id !== data.value.id,
          )

          userStore.$patch({ collections: collections.value })

          toast.add({
            severity: 'success',
            detail: `Collection [${data.value.name}] was deleted.`,
            life: 3000,
          })

          router.go(-1)
        })
        .catch((error) => {
          toast.add({ severity: 'error', summary: error.message, life: 3000 })
        })
    },
  })
}

const copyShareUrl = () => {
  navigator.clipboard.writeText(config.public.baseUrl + route.fullPath)
  toast.add({
    severity: 'success',
    summary: 'Copied to clipboard!',
    life: 3000,
  })
}

const visible = ref(false)
const toggleShowEdit = (shouldRefresh) => {
  visible.value = !visible.value
  if (shouldRefresh) {
    refresh()
  }
}
</script>
