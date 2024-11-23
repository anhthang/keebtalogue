<template>
  <div>
    <PanelBreadcrumb :breadcrumbs="breadcrumbs" />

    <Panel v-if="maker" pt:root:class="!border-0 !bg-transparent">
      <template #header>
        <div class="flex items-center gap-4 font-medium text-3xl">
          <Avatar
            :image="`/logo/${maker.id}.png`"
            :class="{
              invert: maker.invertible_logo && $colorMode.value === 'dark',
            }"
            size="large"
            pt:image:class="object-contain"
          />
          {{ maker.name }}
          <i
            v-if="maker.verified"
            v-tooltip="'Verified'"
            class="pi pi-verified text-lg text-[#22c55e] dark:text-[#4ade80]"
          />
        </div>
      </template>

      <div v-if="maker.bio" class="mb-4 leading-6 text-muted-color">
        <p v-for="(line, idx) in maker.bio.split('\n')" :key="idx" class="mb-2">
          {{ line }}
        </p>
      </div>

      <template #icons>
        <MakerProfileActions
          :maker="maker"
          @on-edit-maker="toggleEditMaker"
          @on-add-sale="toggleAddSale"
        />
      </template>

      <DataView
        :value="sculpts"
        layout="grid"
        paginator
        :rows="60"
        :total-records="sculpts.length"
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
            <nuxt-link
              v-for="sculpt in items"
              :key="sculpt.id"
              :to="`/artisan/maker/${maker.id}/${sculpt.sculpt_id}`"
            >
              <Card
                class="flex items-center flex-1 overflow-hidden"
                :pt="{
                  root: 'h-full',
                  header: 'w-full h-44 md:h-60',
                  caption: 'flex items-center',
                  title: 'w-40 text-center truncate',
                }"
              >
                <template #header>
                  <img
                    loading="lazy"
                    :alt="sculpt.name"
                    :src="sculpt.img"
                    class="w-full h-full object-cover"
                  />
                </template>
                <template #title>{{ sculpt.name }}</template>
                <template #subtitle
                  >{{ sculpt.total_colorways }} colorways</template
                >
              </Card>
            </nuxt-link>
          </div>
        </template>
      </DataView>

      <Dialog
        v-model:visible="visible.edit"
        modal
        header="Edit Maker"
        class="w-[36rem]"
        dismissable-mask
      >
        <ModalMakerForm
          :is-edit="true"
          :metadata="maker"
          @on-success="toggleEditMaker"
        />
      </Dialog>

      <Dialog
        v-model:visible="visible.add_sale"
        modal
        header="Add Upcoming Sale"
        class="w-[36rem]"
        dismissable-mask
      >
        <ModalSaleForm
          :is-edit="true"
          :metadata="sculptLst"
          @on-success="toggleAddSale"
        />
      </Dialog>
    </Panel>
    <BackToArtisanMakers v-else />
  </div>
</template>

<script setup>
const route = useRoute()
const visible = ref({
  edit: false,
  add_sale: false,
})

const { data: maker, refresh } = await useAsyncData(
  `maker:${route.params.maker}`,
  () => $fetch(`/api/makers/${route.params.maker}`),
  {
    watch: () => route.params.maker,
  },
)

const sculpts = Object.values(maker.value.sculpts)

const breadcrumbs = computed(() => {
  return [
    {
      icon: 'pi pi-home',
      route: '/',
    },
    {
      label: 'Makers',
      route: '/artisan/maker',
    },
  ]
})

useSeoMeta({
  title: maker.value?.name,
  description: maker.value?.bio,
  ogDescription: maker.value?.bio,
  twitterDescription: maker.value?.bio,
})

defineOgImageComponent('Artisan', {
  makerId: maker.value?.id,
  invertible: maker.value?.invertible_logo,
})

const toggleEditMaker = (shouldRefresh) => {
  visible.value.edit = !visible.value.edit
  if (shouldRefresh) {
    refresh()
  }
}

const toggleAddSale = () => {
  visible.value.add_sale = !visible.value.add_sale
}

const sculptLst = computed(() => {
  return maker && maker.value.sculpts
    ? Object.entries(maker.value.sculpts).reduce((out, [sculptId, sculpt]) => {
        out[sculptId] = sculpt.name
        return out
      }, {})
    : {}
})
</script>
