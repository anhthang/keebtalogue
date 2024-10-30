<template>
  <Panel
    :header="title"
    pt:root:class="!border-0 !bg-transparent"
    pt:title:class="flex items-center gap-4 font-medium text-3xl"
  >
    <template #icons>
      <Button
        v-if="isEditor"
        label="Add"
        icon="pi pi-file-plus"
        @click="showAddKeycap"
      />
    </template>

    <div
      v-if="data.profile && data.profile.description"
      class="mb-4 leading-6 text-muted-color"
    >
      {{ data.profile.description }}
    </div>

    <div
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
    >
      <nuxt-link
        v-for="keycap in data.keycaps"
        :key="keycap.id"
        :to="`/keycap/${keycap.profile_keycap_id}`"
      >
        <Card
          class="flex flex-1 overflow-hidden"
          pt:header:class="h-48 md:h-60"
          pt:subtitle:class="flex justify-between"
        >
          <template #header>
            <img
              loading="lazy"
              :alt="keycap.name"
              :src="keycap.img || keycap.render_img"
              class="w-full h-full object-cover"
            />
          </template>
          <template #title>{{ keycap.name }}</template>
          <template #subtitle>
            <span>
              <i class="pi pi-palette" />
              {{ keycap.designer }}
            </span>
            <span v-if="query.status === 'Interest Check'">
              <i class="pi pi-clock" /> {{ formatDate(keycap.ic_date) }}
            </span>
            <span v-else-if="query.status === 'Live'">
              <i class="pi pi-clock" />
              {{ formatDateRange(keycap.start_date, keycap.end_date) }}
            </span>
            <span v-else>
              <i class="pi pi-clock" />
              {{ formatDateRange(keycap.start_date, keycap.end_date) }}
            </span>
          </template>
        </Card>
      </nuxt-link>
    </div>

    <Paginator
      class="mt-4"
      :rows="size"
      :total-records="data.count"
      :always-show="false"
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
      header="Add Keycap"
      dismissable-mask
      class="w-[36rem]"
    >
      <ModalKeycapForm :metadata="query" @on-success="showAddKeycap" />
    </Dialog>
  </Panel>
</template>

<script setup>
const userStore = useUserStore()
const { isEditor } = storeToRefs(userStore)

const route = useRoute()
const { profile } = route.params

const page = ref(1)
const size = ref(16)

const statusMap = {
  'interest-check': 'Interest Check',
  'pre-order': 'Live',
}

const query = computed(() => {
  return {
    page: page.value,
    size: size.value,
    profile_id: manufacturers[profile] && profile,
    status: statusMap[profile],
  }
})

const title = manufacturers[profile]
  ? manufacturers[profile]
  : profile === 'live'
    ? 'Live Group Buys'
    : statusMap[profile]

const { data, refresh } = await useAsyncData(
  () => $fetch('/api/keycaps', { query: query.value }),
  {
    watch: [page, size],
  },
)

useSeoMeta({
  title,
  description: data.value.profile && data.value.profile.description,
  ogDescription: data.value.profile && data.value.profile.description,
  // ogImage: data.value.profile && data.value.profile.img,
  twitterDescription: data.value.profile && data.value.profile.description,
  // twitterImage: data.value.profile && data.value.profile.img,
})

const visible = ref(false)
const showAddKeycap = (shouldRefresh) => {
  visible.value = !visible.value
  if (shouldRefresh) {
    refresh()
  }
}
</script>
