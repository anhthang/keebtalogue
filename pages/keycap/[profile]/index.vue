<template>
  <div class="container artisan-container">
    <a-spin :spinning="pending">
      <a-page-header :title="title">
        <template #extra>
          <a-button v-if="isEditor" type="primary" @click="showAddKeycap">
            <user-add-outlined /> Add
          </a-button>
        </template>

        <a-modal
          v-model:open="visible"
          title="New Keycap"
          destroy-on-close
          :confirm-loading="confirmLoading"
          @ok="addKeycap"
        >
          <modal-keycap-form ref="keycapForm" />
        </a-modal>

        <a-row :gutter="[8, 8]" type="flex">
          <a-col
            v-for="keycap in data.keycaps"
            :key="keycap.id"
            :xs="12"
            :sm="12"
            :md="8"
            :xl="6"
          >
            <nuxt-link :to="`/keycap/${keycap.profile_keycap_id}`">
              <a-card
                hoverable
                :title="keycap.name"
                :head-style="artisanCardHeadStyle"
              >
                <template #cover>
                  <img loading="lazy" :alt="keycap.name" :src="keycap.img" />
                </template>
                <!-- <a-card-meta :title="keycap.name" :description="keycap.designer" /> -->
              </a-card>
            </nuxt-link>
          </a-col>
        </a-row>

        <a-flex justify="center" style="margin-top: 16px">
          <a-pagination
            v-model:current="page"
            :total="data.count"
            :page-size="size"
            :show-size-changer="false"
            :show-quick-jumper="data.count > size * 10"
          />
        </a-flex>
      </a-page-header>
    </a-spin>
  </div>
</template>

<script setup>
const userStore = useUserStore()
const { isEditor } = storeToRefs(userStore)

const route = useRoute()
const profileMap = {
  gmk: 'GMK',
  sa: 'SA',
  jtk: 'JTK',
}

const title = profileMap[route.params.profile]

useSeoMeta({
  title,
})

const page = ref(1)
const size = ref(24)

const { data, pending } = await useAsyncData(
  () =>
    $fetch('/api/keycaps', {
      query: {
        query: route.params.profile,
        page: page.value,
        size: size.value,
      },
    }),
  {
    watch: [page, size],
  },
)

const confirmLoading = ref(false)
const visible = ref(false)
const keycapForm = ref()

const showAddKeycap = () => {
  visible.value = !visible.value
}

const addKeycap = async () => {
  confirmLoading.value = true

  await keycapForm.value.addKeycap()

  confirmLoading.value = false
  showAddKeycap()
}
</script>
