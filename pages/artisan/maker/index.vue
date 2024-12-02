<template>
  <Panel
    header="Artisan Makers"
    pt:root:class="!border-0 !bg-transparent"
    pt:title:class="flex items-center gap-4 font-medium text-3xl"
  >
    <template v-if="isAdmin" #icons>
      <div class="flex gap-2">
        <Button label="Add" icon="pi pi-user-plus" @click="toggleAddMaker" />

        <Button
          v-if="authenticated"
          icon="pi pi-sliders-v"
          label="Customize Pins"
          severity="secondary"
          @click="toggleCustomizePins"
        />
      </div>
    </template>

    <div
      v-if="authenticated && favoriteMakers.length"
      class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6 gap-4"
    >
      <MakerCard
        v-for="maker in favoriteMakers"
        :key="maker.id"
        :maker="maker"
      />
    </div>

    <DataView
      :value="otherMakers"
      layout="grid"
      paginator
      :rows="authenticated && Object.keys(favorites).length ? 54 : 60"
      :total-records="otherMakers.length"
      :always-show-paginator="false"
      :pt="{
        header: '!bg-transparent !border-0 text-lg font-medium',
        content: '!bg-transparent',
        pcPaginator: {
          paginatorContainer: '!border-0 pt-4',
          root: '!bg-transparent',
        },
      }"
    >
      <template v-if="Object.keys(favorites).length" #header>
        Other Makers
      </template>
      <template #grid="{ items }">
        <div
          class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6 gap-4"
        >
          <MakerCard v-for="maker in items" :key="maker.id" :maker="maker" />
        </div>
      </template>
    </DataView>

    <Dialog
      v-model:visible="visible"
      modal
      header="Add Maker"
      class="w-[36rem]"
      dismissable-mask
    >
      <ModalMakerForm @on-success="toggleAddMaker" />
    </Dialog>

    <Dialog
      v-model:visible="customize"
      modal
      header="Customize Pins"
      class="w-[36rem]"
      dismissable-mask
    >
      <ModalPinMaker
        :makers="favoriteMakers.concat(otherMakers)"
        @on-success="toggleCustomizePins"
      />
    </Dialog>
  </Panel>
</template>

<script setup>
useSeoMeta({
  title: 'Artisan Makers',
})

const { data, refresh } = await useAsyncData('artisan-makers', () =>
  $fetch('/api/makers'),
)

const userStore = useUserStore()
const { authenticated, isAdmin, favorites } = storeToRefs(userStore)

const visible = ref(false)
const toggleAddMaker = (shouldRefresh) => {
  visible.value = !visible.value
  if (shouldRefresh) {
    refresh()
  }
}

const customize = ref(false)
const toggleCustomizePins = () => {
  customize.value = !customize.value
}

const favoriteMakers = computed(() => {
  return data.value.filter((m) => Object.keys(favorites.value).includes(m.id))
})

const otherMakers = computed(() => {
  return data.value.filter((m) => !Object.keys(favorites.value).includes(m.id))
})
</script>
