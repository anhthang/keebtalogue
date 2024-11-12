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
            v-if="published && data?.type === 'share'"
            icon="pi pi-copy"
            label="Copy"
            @click="copyShareUrl"
          />

          <Button
            v-if="authenticated"
            icon="pi pi-pen-to-square"
            label="Edit"
            @click="toggleShowEdit"
          />

          <Button
            v-if="user.email_verified"
            severity="danger"
            icon="pi pi-trash"
            label="Delete"
            @click="deleteCollection"
          />

          <SplitButton
            :label="sortItem.label"
            :icon="sortItem.icon"
            :model="sortOptions"
          />
        </div>
        <Button
          v-else
          aria-haspopup="true"
          aria-controls="overlay_menu"
          icon="pi pi-ellipsis-v"
          @click="toggleActions"
        >
        </Button>
        <Menu id="overlay_menu" ref="menu" :model="mobile" :popup="true" />
      </template>

      <Message
        v-if="published && data?.type === 'share'"
        class="w-fit mx-auto mb-4"
        severity="warn"
        icon="pi pi-exclamation-circle"
      >
        <strong> Public access granted. </strong>
        Anyone with the link will be able to see it.
      </Message>
      <Message
        v-if="published && data?.type !== 'share'"
        class="w-fit mx-auto mb-4"
        severity="warn"
        icon="pi pi-exclamation-circle"
      >
        <strong> Heads up! </strong>
        This collection is listed for buying and selling. It's visible to others
        on our marketplace.
      </Message>

      <div
        class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6 gap-4"
      >
        <Card
          v-for="colorway in sortedCollections"
          :key="colorway.id"
          class="flex items-center flex-1 overflow-hidden"
          :pt="{
            header: 'h-44 md:h-60',
            body: 'items-center',
            caption: 'items-center',
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
          <template #title>{{ colorway.name || '-' }}</template>
          <template #subtitle>{{ colorway.sculpt_name }}</template>

          <template v-if="authenticated" #footer>
            <Button
              text
              size="small"
              severity="danger"
              label="Remove"
              icon="pi pi-trash"
              @click="removeCap(colorway)"
            />
          </template>
        </Card>
      </div>

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
      label: 'Collections',
      route: `/artisan/collection`,
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

const localIds = ['want', 'have']

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
  } else if (!localIds.includes(route.params.collection)) {
    return $fetch(`/api/collections/${route.params.collection}`)
  }
})

const published = authenticated.value && data.value?.published

useSeoMeta({
  title: data.value?.name ? `${data.value.name} • Collection` : 'Collection',
})

onMounted(() => {
  if (localIds.includes(route.params.collection)) {
    const collection = collections.value.find(
      (c) => c.id === route.params.collection,
    )
    const items = JSON.parse(
      localStorage.getItem(`Keebtalogue_${route.params.collection}`) || '[]',
    )

    data.value = {
      ...collection,
      items,
    }
  }
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
      label: 'Actions',
      visible: authenticated,
      items: [
        {
          label: 'Copy',
          icon: 'pi pi-copy',
          visible: published && data.value?.type === 'share',
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

const removeCap = (clw) => {
  confirm.require({
    header: 'Remove Artisan',
    message: `Are you sure you want to remove ${colorwayTitle(clw)}?`,
    rejectProps: {
      size: 'small',
    },
    acceptProps: {
      size: 'small',
      label: 'Remove',
      severity: 'danger',
    },
    accept: () => {
      if (authenticated.value) {
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
      } else {
        sortedCollections.value = sortedCollections.value.filter(
          (c) => c.colorway_id !== clw.colorway_id,
        )
        localStorage.setItem(
          `Keebtalogue_${route.params.collection}`,
          JSON.stringify(sortedCollections.value),
        )

        toast.add({
          severity: 'success',
          summary: `${colorwayTitle(clw)} was removed.`,
          life: 3000,
        })
      }
    },
  })
}

const deleteCollection = () => {
  confirm.require({
    header: 'Delete Collection',
    message: 'Are you sure you want to continue?',
    rejectProps: {
      size: 'small',
    },
    acceptProps: {
      size: 'small',
      label: 'Remove',
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
