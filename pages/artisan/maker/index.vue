<template>
  <Panel class="container" pt:root:class="!border-0 !bg-transparent">
    <template #header>
      <div class="flex items-center gap-4 font-medium text-3xl">
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

    <Dialog
      v-model:visible="visible"
      modal
      header="Add Maker"
      class="w-[35rem]"
      dismissable-mask
    >
      <modal-maker-form />
    </Dialog>
  </Panel>
</template>

<script setup>
useSeoMeta({
  title: 'Artisan Makers',
})

const page = ref(1)
const size = ref(24)

const { data } = await useAsyncData('artisan-makers', () =>
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
</script>
