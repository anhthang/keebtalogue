<template>
  <div class="container keycap-container">
    <a-spin :spinning="pending">
      <a-page-header :title="title">
        <template #extra>
          <a-button v-if="isEditor" type="primary" @click="showAddKeycap">
            <folder-add-outlined /> Add
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
              <a-card hoverable :head-style="artisanCardHeadStyle">
                <template #cover>
                  <img loading="lazy" :alt="keycap.name" :src="keycap.img" />
                </template>
                <a-card-meta :title="keycap.name">
                  <template #description>
                    <a-flex justify="space-between">
                      <span><bg-colors-outlined /> {{ keycap.designer }}</span>
                      <span><calendar-outlined /> {{ keycap.timeline }} </span>
                    </a-flex>
                  </template>
                </a-card-meta>
              </a-card>
            </nuxt-link>
          </a-col>
        </a-row>

        <a-flex
          v-if="data.count > 24"
          justify="center"
          style="margin-top: 16px"
        >
          <a-pagination
            v-model:current="page"
            :total="data.count"
            :page-size="size"
            :show-size-changer="false"
            :show-quick-jumper="data.count > size * 10"
          />
        </a-flex>

        <a-result
          v-if="!data.keycaps.length"
          status="404"
          title="We're currently updating our catalog"
          sub-title="There are no keycaps available right now. Check back soon for exciting new additions!"
        />
      </a-page-header>
    </a-spin>
  </div>
</template>

<script setup>
const userStore = useUserStore()
const { isEditor } = storeToRefs(userStore)

const route = useRoute()

const title = allProfiles[route.params.profile]

useSeoMeta({
  title,
})

const page = ref(1)
const size = ref(24)

const { data, pending, refresh } = await useAsyncData(
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

  await keycapForm.value
    .addKeycap()
    .then(() => {
      confirmLoading.value = false
      showAddKeycap()
      refresh()
    })
    .catch(() => {
      confirmLoading.value = false
    })
}
</script>

<style>
.keycap-container {
  .ant-card-cover {
    height: 250px;
    overflow: hidden;

    @media (max-width: 480px) {
      height: 150px;
    }
  }

  /* iPad */
  .ant-card-cover img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>
