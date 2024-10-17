<template>
  <Panel class="container" pt:root:class="!border-0 !bg-transparent">
    <template #header>
      <div
        class="flex items-center gap-4 text-2xl leading-8 text-color font-bold"
      >
        Artisan Makers
      </div>
    </template>

    <template v-if="isAdmin" #icons>
      <Button label="Add" icon="pi pi-user-plus" @click="showModal" />
    </template>

    <div
      v-if="authenticated && favoriteMakers.length"
      class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4"
    >
      <maker-card
        v-for="maker in favoriteMakers"
        :key="maker.id"
        :favorite="true"
        :maker="maker"
      />
    </div>

    <Divider v-if="authenticated && favoriteMakers.length" align="left">
      Others
    </Divider>

    <div
      class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4"
    >
      <maker-card
        v-for="maker in currentPageMakers"
        :key="maker.id"
        :maker="maker"
      />
    </div>

    <Paginator
      class="mt-4"
      :rows="size"
      :total-records="otherMakers.length"
      pt:root:class="!bg-transparent"
      @page="
        (e) => {
          page = e.page + 1
        }
      "
    />

    <a-modal
      v-model:open="visible"
      title="Add Maker"
      destroy-on-close
      :confirm-loading="confirmLoading"
      ok-text="Add"
      @ok="addMaker"
    >
      <modal-maker-form ref="makerForm" />
    </a-modal>
  </Panel>
</template>

<script setup>
useSeoMeta({
  title: 'Artisan Makers',
})

const page = ref(1)
const size = ref(24)

const { data, refresh } = await useAsyncData('artisan-makers', () =>
  $fetch('/api/makers'),
)

const userStore = useUserStore()
const { authenticated, isAdmin, favorites } = storeToRefs(userStore)

const visible = ref(false)
const showModal = () => {
  visible.value = !visible.value
}

const favoriteMakers = computed(() => {
  return data.value.filter((m) => favorites.value.includes(m.id))
})

const otherMakers = computed(() => {
  return data.value.filter((m) => !favorites.value.includes(m.id))
})

const currentPageMakers = computed(() => {
  return otherMakers.value.slice(
    (page.value - 1) * size.value,
    page.value * size.value,
  )
})

const makerForm = ref()
const confirmLoading = ref(false)
const addMaker = async () => {
  confirmLoading.value = true

  await makerForm.value
    .addMaker()
    .then(() => {
      confirmLoading.value = false
      showModal()
      refresh()
    })
    .catch(() => {
      confirmLoading.value = false
    })
}
</script>
