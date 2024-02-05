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
          title="Add Keycap"
          destroy-on-close
          :confirm-loading="confirmLoading"
          ok-text="Add"
          @ok="addKeycap"
        >
          <modal-keycap-form ref="keycapForm" :metadata="query" />
        </a-modal>

        <a-typography v-if="data.profile && data.profile.description">
          <a-typography-paragraph
            v-for="(line, idx) in data.profile.description.split('\n')"
            :key="idx"
          >
            {{ line }}
          </a-typography-paragraph>
        </a-typography>

        <a-row :gutter="[8, 8]" type="flex">
          <a-col
            v-for="keycap in data.keycaps"
            :key="keycap.id"
            :xs="24"
            :sm="24"
            :md="12"
            :lg="8"
            :xl="6"
          >
            <nuxt-link :to="`/keycap/${keycap.profile_keycap_id}`">
              <a-card hoverable :head-style="artisanCardHeadStyle">
                <template #cover>
                  <img
                    loading="lazy"
                    :alt="keycap.name"
                    :src="keycap.img || keycap.render_img"
                  />
                </template>
                <a-card-meta
                  :title="
                    ['Interest Check', 'Live'].includes(query.status)
                      ? `${manufacturers[keycap.profile_id]} ${keycap.name}`
                      : keycap.name
                  "
                >
                  <template #description>
                    <a-flex justify="space-between">
                      <span><bg-colors-outlined /> {{ keycap.designer }}</span>
                      <span v-if="query.status === 'Interest Check'">
                        <calendar-outlined /> {{ formatDate(keycap.ic_date) }}
                      </span>
                      <span v-else-if="query.status === 'Live'">
                        <calendar-outlined />
                        {{
                          formatDateRange(keycap.start_date, keycap.end_date)
                        }}
                      </span>
                      <span v-else>
                        <clock-circle-outlined />
                        {{
                          formatDateRange(keycap.start_date, keycap.end_date)
                        }}
                      </span>
                    </a-flex>
                  </template>
                </a-card-meta>
              </a-card>
            </nuxt-link>
          </a-col>
        </a-row>

        <a-flex
          v-if="data.count > size"
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
const { profile } = route.params

const page = ref(1)
const size = ref(16)

const statusMap = {
  'interest-check': 'Interest Check',
  live: 'Live',
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

const { data, pending, refresh } = await useAsyncData(
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
      height: 200px;
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
