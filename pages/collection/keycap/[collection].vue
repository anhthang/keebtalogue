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
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            <Card
              v-for="{ id, keycap } in items"
              :key="keycap.id"
              class="overflow-hidden"
              pt:header:class="h-48 md:h-60"
              pt:subtitle:class="flex justify-between"
            >
              <template #header>
                <img
                  loading="lazy"
                  :alt="keycap.name"
                  :src="keycap.img || keycap.render_img"
                  class="h-full object-cover"
                />
              </template>
              <template #title>
                {{ `${keycap.profile.name} ${keycap.name}` || '-' }}
              </template>
              <template #subtitle>
                <span class="flex items-center gap-1">
                  <i class="pi pi-palette" />
                  {{ keycap.designer }}
                </span>
              </template>

              <template #footer>
                <Button
                  size="small"
                  text
                  label="Remove"
                  fluid
                  severity="danger"
                  icon="pi pi-trash"
                  @click="remove(id, keycap)"
                />
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

const userStore = useUserStore()
const { authenticated, collections, user } = storeToRefs(userStore)

const confirm = useConfirm()
const route = useRoute()
const router = useRouter()
const toast = useToast()

const { data, refresh } = await useAsyncData(() =>
  $fetch(`/api/collections/${route.params.collection}`),
)

useSeoMeta({
  title: data.value?.name ? `${data.value.name} • Collection` : 'Collection',
})

watchEffect(() => route.params.collection, refresh())

const sortedCollections = computed(() => {
  return sortBy(data.value?.items || [], ['keycap.name'])
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
  ]
})

const remove = (id, keycap) => {
  confirm.require({
    header: 'Confirm to remove keycap',
    message: `Are you sure you want to remove ${keycap.name}?`,
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
        `/api/users/${user.value.uid}/collections/${route.params.collection}/items/${id}`,
        { method: 'delete' },
      )
        .then(() => {
          refresh()
          toast.add({
            severity: 'success',
            summary: `${keycap.name} was removed.`,
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

const visible = ref(false)
const toggleShowEdit = (shouldRefresh) => {
  visible.value = !visible.value
  if (shouldRefresh) {
    refresh()
  }
}
</script>
