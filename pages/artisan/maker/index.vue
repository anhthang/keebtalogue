<template>
  <a-spin :spinning="pending">
    <a-page-header title="Artisan Makers" class="container maker-container">
      <template v-if="isAdmin" #extra>
        <Button label="Add" icon="pi pi-user-plus" @click="showModal" />
      </template>
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

      <Divider v-if="authenticated && favoriteMakers.length" align="left">
        Pinned
      </Divider>

      <div
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
    </a-page-header>
  </a-spin>
</template>

<script setup>
useSeoMeta({
  title: 'Artisan Makers',
})

const page = ref(1)
const size = ref(24)

const { data, pending, refresh } = await useAsyncData('artisan-makers', () =>
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
