<template>
  <Panel
    :header="data.name || 'Collection'"
    class="container"
    pt:root:class="!border-0 !bg-transparent"
    pt:header:class="flex items-center gap-4 font-medium text-3xl"
  >
    <template #icons>
      <div class="flex gap-2">
        <SplitButton
          v-model="sort"
          label="Sort"
          icon="pi pi-sort"
          :model="sortOptions"
        />

        <Button
          v-if="authenticated && data.published && data.type === 'share'"
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

        <ConfirmDialog />
        <Toast />
        <Button
          v-if="user.email_verified"
          severity="danger"
          icon="pi pi-trash"
          label="Delete"
          @click="deleteCollection(data)"
        />
      </div>
    </template>

    <div
      class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4"
    >
      <Card
        v-for="colorway in sortedCollections"
        :key="colorway.id"
        class="flex items-center flex-1 overflow-hidden"
        pt:header:class="h-[250px]"
        pt:body:class="items-center"
      >
        <template #header>
          <img
            :alt="colorway.name"
            :src="colorway.img"
            class="h-full object-cover"
          />
        </template>
        <template #title>{{ colorway.name }}</template>

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

    <a-modal
      v-model:open="visible"
      title="Edit Collection"
      destroy-on-close
      :confirm-loading="confirmLoading"
      @ok="editCollection"
    >
      <modal-collection-form
        ref="collectionForm"
        :metadata="data"
        :uid="user.uid"
        :is-edit="true"
      />
    </a-modal>
  </Panel>
</template>

<script setup>
import sortBy from 'lodash.sortby'
import copy from 'ant-design-vue/lib/_util/copy-to-clipboard'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'

const confirm = useConfirm()
const toast = useToast()

const sortOptions = [
  {
    label: 'Sort by Sculpt',
    icon: 'pi pi-sort',
    command: () => {
      sort.value = 'sculpt_name'
    },
  },
  {
    label: 'Sort by Colorway',
    icon: 'pi pi-sort-alpha-down',
    command: () => {
      sort.value = 'name'
    },
  },
]

const localIds = ['want', 'have']

const config = useRuntimeConfig()

const userStore = useUserStore()
const { authenticated, collections, user } = storeToRefs(userStore)

const route = useRoute()
const router = useRouter()

const sort = ref('sculpt_name')

const { data, refresh } = await useAsyncData(() => {
  if (authenticated.value) {
    return $fetch(
      `/api/users/${user.value.uid}/collections/${route.params.collection}`,
    )
  } else if (!localIds.includes(route.params.collection)) {
    return $fetch(`/api/collections/${route.params.collection}`)
  }
})

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
  return sortBy(data.value.items, ['maker_id', sort.value])
})

const removeCap = (clw) => {
  confirm.require({
    header: 'Remove Artisan',
    message: `Are you sure you want to remove ${colorwayTitle(clw)}?`,
    acceptProps: {
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

const deleteCollection = (collection) => {
  confirm.require({
    header: 'Delete Collection',
    message: 'Are you sure you want to continue?',
    acceptProps: {
      label: 'Remove',
      severity: 'danger',
    },
    accept: () => {
      $fetch(`/api/users/${collection.uid}/collections/${collection.id}`, {
        method: 'delete',
      })
        .then(() => {
          collections.value = collections.value.filter(
            (c) => c.id !== collection.id,
          )

          userStore.$patch({ collections: collections.value })

          toast.add({
            severity: 'success',
            detail: `Collection [${collection.name}] was deleted.`,
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
  copy(config.public.baseUrl + route.fullPath)
  toast.add({
    severity: 'success',
    summary: 'Copied to clipboard!',
    life: 3000,
  })
}

const visible = ref(false)
const toggleShowEdit = () => {
  visible.value = !visible.value
}

const confirmLoading = ref(false)
const collectionForm = ref()
const editCollection = async () => {
  confirmLoading.value = true

  await collectionForm.value
    .addCollection()
    .then(() => {
      confirmLoading.value = false
      refresh()
      toggleShowEdit()
    })
    .catch(() => {
      confirmLoading.value = false
    })
}
</script>
