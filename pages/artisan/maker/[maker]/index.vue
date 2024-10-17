<template>
  <Panel
    class="container artisan-container"
    pt:root:class="!border-0 !bg-transparent"
  >
    <template #header>
      <div
        class="flex items-center gap-4 text-2xl leading-8 text-color font-bold"
      >
        <Avatar
          :image="`/logo/${maker.id}.png`"
          :class="
            maker.invertible_logo && $colorMode.value === 'dark'
              ? 'invertible-logo'
              : ''
          "
          size="large"
          pt:image:class="object-contain"
        />
        {{ maker.name }}
      </div>
    </template>

    <div v-if="maker.intro" class="mb-4 leading-6 text-muted-color">
      {{ maker.intro }}
    </div>

    <template #icons>
      <div class="flex gap-2">
        <Button
          v-if="isEditor"
          icon="pi pi-pen-to-square"
          label="Edit"
          @click="showEditMakerModal"
        />

        <Button
          v-if="isEditor"
          icon="pi pi-calendar"
          label="Sales"
          @click="showAddSaleModal"
        />

        <MakerHelpfulLinks :maker="maker" />
      </div>
    </template>

    <div
      class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4"
    >
      <nuxt-link
        v-for="sculpt in maker.sculpts"
        :key="sculpt.id"
        :to="`/artisan/maker/${maker.id}/${sculpt.sculpt_id}`"
      >
        <Card
          class="flex items-center flex-1 overflow-hidden"
          pt:header:class="h-[250px]"
        >
          <template #header>
            <img
              :alt="sculpt.name"
              :src="sculpt.img"
              class="h-full object-cover"
            />
          </template>
          <template #title>{{ sculpt.name }}</template>
        </Card>
      </nuxt-link>
    </div>

    <a-modal
      v-model:open="visible.edit"
      title="Edit Maker"
      destroy-on-close
      :confirm-loading="confirmLoading"
      ok-text="Save"
      @ok="updateMakerProfile"
    >
      <modal-maker-form ref="makerForm" :is-edit="true" :metadata="maker" />
    </a-modal>

    <a-modal
      v-model:open="visible.add_sale"
      title="Add Upcoming Sale"
      destroy-on-close
      :confirm-loading="confirmLoading"
      @ok="addUpcomingSale"
    >
      <modal-sale-form ref="saleForm" :is-edit="true" :metadata="sculptLst" />
    </a-modal>
  </Panel>
</template>

<script setup>
const userStore = useUserStore()
const { isEditor } = storeToRefs(userStore)

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

useSeoMeta({
  title: maker.value && maker.value.name,
  description: maker.value && maker.value.intro,
  ogDescription: maker.value && maker.value.intro,
  ogImage: `/logo/${route.params.maker}.png`,
  twitterDescription: maker.value && maker.value.intro,
  twitterImage: `/logo/${route.params.maker}.png`,
})

const showEditMakerModal = () => {
  visible.value.edit = !visible.value.edit
}

const confirmLoading = ref(false)

const makerForm = ref()
const updateMakerProfile = async () => {
  confirmLoading.value = true

  await makerForm.value
    .addMaker()
    .then(() => {
      confirmLoading.value = false
      showEditMakerModal()
      refresh()
    })
    .catch(() => {
      confirmLoading.value = false
    })
}

const showAddSaleModal = () => {
  visible.value.add_sale = !visible.value.add_sale
}

const saleForm = ref()
const addUpcomingSale = async () => {
  confirmLoading.value = true

  await saleForm.value.addSale()

  showAddSaleModal()
  confirmLoading.value = false
}

const sculptLst = computed(() => {
  return maker && maker.value.sculpts
    ? Object.entries(maker.value.sculpts).reduce((out, [sculptId, sculpt]) => {
        out[sculptId] = sculpt.name
        return out
      }, {})
    : {}
})

// const getFlagEmoji = (isoCode) => {
//   if (isoCode === 'GB-ENG') {
//     return '🏴󠁧󠁢󠁥󠁮󠁧󠁿'
//   }
//   if (isoCode === 'GB-WLS') {
//     return '🏴󠁧󠁢󠁷󠁬󠁳󠁿'
//   }
//   if (isoCode === 'GB-SCT') {
//     return '🏴󠁧󠁢󠁳󠁣󠁴󠁿'
//   }
//   if (isoCode === 'GB-NIR') {
//     // The only official flag in Northern Ireland is the Union Flag of the United Kingdom.
//     return '🇬🇧'
//   }

//   return isoCode
//     .toUpperCase()
//     .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)))
// }
</script>

<style>
.contributors span,
.contributors .ant-avatar + .ant-avatar {
  -webkit-transition: all 0.3s;
  transition: all 0.3s;
  -webkit-margin-end: -8px;
  margin-inline-end: -8px;
}

.contributors:hover span,
.contributors:hover .ant-avatar {
  -webkit-margin-end: 0;
  margin-inline-end: 0;
}
</style>
