<template>
  <div class="container">
    <a-spin :spinning="pending">
      <a-page-header v-if="data" :title="data.name">
        <template #breadcrumb>
          <a-breadcrumb>
            <a-breadcrumb-item> Keycap </a-breadcrumb-item>
            <a-breadcrumb-item>
              <nuxt-link
                v-if="data.status === 'Interest Check'"
                to="/keycap/interest-check"
              >
                Interest Check
              </nuxt-link>
              <nuxt-link v-else :to="`/keycap/${data.profile_id}`">
                {{ manufacturers[data.profile_id] }}
              </nuxt-link>
            </a-breadcrumb-item>
          </a-breadcrumb>
        </template>

        <template #extra>
          <nuxt-link
            v-if="isEditor"
            :to="`/keycap/${data.profile_keycap_id}/kit`"
          >
            <a-button type="primary">
              <appstore-add-outlined /> Manage Kits
            </a-button>
          </nuxt-link>

          <a-button v-if="isEditor" @click="toggleShowEditKeycap">
            <edit-outlined /> Edit
          </a-button>

          <a-button
            v-if="data.order_graph || data.order_history"
            @click="toggleShowChart"
          >
            <bar-chart-outlined /> Sales Chart
          </a-button>

          <a v-if="data.url" :href="data.url" target="_blank">
            <a-button> <link-outlined /> Link </a-button>
          </a>
        </template>

        <a-modal
          v-model:open="showEditKeycap"
          title="Edit Keycap"
          destroy-on-close
          :confirm-loading="confirmLoading"
          ok-text="Save"
          @ok="updateKeycap"
        >
          <modal-keycap-form
            ref="keycapForm"
            :is-edit="true"
            :metadata="data"
          />
        </a-modal>

        <a-row v-if="data.kits.length" :gutter="[16, 16]" type="flex">
          <a-col :sm="16">
            <a-flex vertical gap="small">
              <a-carousel
                ref="kitSlide"
                arrows
                dots-class="slick-thumb"
                autoplay
                effect="fade"
                :before-change="beforeChangeSlide"
              >
                <a-card v-for="kit in data.kits" :key="kit.id">
                  <template #cover>
                    <a-image loading="lazy" :alt="kit.name" :src="kit.img" />
                  </template>
                </a-card>
              </a-carousel>

              <a-typography-text style="text-align: center">
                {{ activeKit.description }}
              </a-typography-text>
            </a-flex>
          </a-col>
          <a-col :sm="8">
            <a-collapse v-model:activeKey="activeKey" :bordered="false">
              <a-collapse-panel
                v-if="data.description"
                key="description"
                header="Description"
              >
                <template #extra><info-circle-outlined /></template>
                <a-typography>
                  <a-typography-paragraph
                    v-for="(line, idx) in data.description.split('\n')"
                    :key="idx"
                  >
                    {{ line }}
                  </a-typography-paragraph>
                </a-typography>
              </a-collapse-panel>

              <a-collapse-panel key="specifications" header="Specifications">
                <template #extra><expand-alt-outlined /></template>
                <a-descriptions :column="1" size="small">
                  <a-descriptions-item v-if="data.designer" label="Designer">
                    {{ data.designer }}
                  </a-descriptions-item>
                  <a-descriptions-item v-if="data.sculpt" label="Sculpt">
                    {{ data.sculpt }}
                  </a-descriptions-item>
                  <a-descriptions-item
                    v-if="data.status === 'Interest Check'"
                    label="IC Date"
                  >
                    {{ formatDate(data.ic_date) }}
                  </a-descriptions-item>
                  <a-descriptions-item v-else label="Timeline">
                    {{ formatDateRange(data.start_date, data.end_date) }}
                  </a-descriptions-item>
                  <a-descriptions-item v-if="data.status" label="Status">
                    <a-tag :color="keycapStatuses[data.status]">
                      {{ data.status }}
                    </a-tag>
                  </a-descriptions-item>
                </a-descriptions>
              </a-collapse-panel>

              <a-collapse-panel key="kits" header="Kits">
                <template #extra><appstore-add-outlined /></template>
                <a-flex wrap="wrap" gap="small">
                  <a-button
                    v-for="(kit, idx) in data.kits"
                    :key="kit.id"
                    :ghost="activeKitIdx === idx"
                    :type="activeKitIdx === idx ? 'primary' : 'default'"
                    @click="gotoSlide(idx)"
                  >
                    {{ kit.name }}

                    <template v-if="kit.cancelled" #icon>
                      <a-tooltip title="Cancelled">
                        <stop-outlined />
                      </a-tooltip>
                    </template>
                  </a-button>
                </a-flex>
              </a-collapse-panel>

              <a-collapse-panel key="disclaimers" header="Disclaimers">
                <template #extra><exclamation-circle-outlined /></template>
                <a-typography-text type="danger">
                  Kindly note that the images are of 3D renders and are for
                  illustration purposes only. The final colors may differ
                  slightly.
                </a-typography-text>
              </a-collapse-panel>
            </a-collapse>
          </a-col>
        </a-row>
        <a-result
          v-else
          status="404"
          title="We're currently updating our catalog"
          sub-title="There are no kits available right now. Check back soon for exciting new additions!"
        />

        <a-tabs v-if="false">
          <a-tab-pane
            v-for="(colorways, maker) in data.artisans"
            :key="maker"
            :tab="maker"
          >
            <a-row :gutter="[16, 16]" type="flex">
              <a-col
                v-for="colorway in colorways"
                :key="colorway.id"
                :xs="24"
                :sm="24"
                :md="8"
                :lg="6"
                :xl="4"
              >
                <a-card hoverable :title="colorwayTitle(colorway)">
                  <template #extra>
                    <bg-colors-outlined
                      v-if="colorway.commissioned"
                      class="commissioned"
                    />
                    <gift-filled v-if="colorway.giveaway" class="giveaway" />
                  </template>
                  <template #cover>
                    <img
                      loading="lazy"
                      :alt="colorway.name"
                      :src="colorway.img"
                      @click="showColorwayInformationModal(colorway)"
                    />
                  </template>

                  <!-- <template v-if="collections.length" #actions>
                    <a-dropdown :trigger="['click']" placement="top">
                      <div><save-outlined /> Add to Collection</div>
                      <template #overlay>
                        <a-menu>
                          <a-menu-item
                            v-for="collection in collections"
                            :key="collection.id"
                            :disabled="!collections.length"
                            @click="addToCollection(collection, colorway)"
                          >
                            {{ collection.name }}
                          </a-menu-item>
                        </a-menu>
                      </template>
                    </a-dropdown>
                  </template> -->
                </a-card>
              </a-col>
            </a-row>
          </a-tab-pane>
        </a-tabs>

        <a-image
          alt="Created by dvorcol"
          :width="200"
          style="display: none"
          :preview="{
            visible,
            onVisibleChange: toggleShowChart,
          }"
          :src="data.order_graph || data.order_history"
        />
        <div style="display: none">
          <a-image-preview-group
            :preview="{ visible, onVisibleChange: (vis) => (visible = vis) }"
          >
            <a-image v-if="data.order_graph" :src="data.order_graph" />
            <a-image v-if="data.order_history" :src="data.order_history" />
          </a-image-preview-group>
        </div>
      </a-page-header>

      <a-result v-else status="404" title="Uh oh! Something went wrong.">
        <template #extra>
          <nuxt-link :to="`/keycap/${route.params.profile}`">
            <a-button type="primary">Back</a-button>
          </nuxt-link>
        </template>
      </a-result>
    </a-spin>
  </div>
</template>

<script setup>
import groupBy from 'lodash.groupby'

const userStore = useUserStore()
const { isEditor } = storeToRefs(userStore)

const activeKey = ref(['description', 'specifications', 'kits', 'disclaimers'])

const route = useRoute()

const { profile, keycap } = route.params

const { data, pending, refresh } = await useAsyncData(
  `keycap/${profile}/${keycap}`,
  () =>
    $fetch(`/api/keycaps/${profile}/${keycap}`).then((data) => {
      data.artisans = groupBy(data.artisans, 'maker_name')
      return data
    }),
  {
    watch: [() => profile, () => keycap],
  },
)

useSeoMeta({
  title: data.value
    ? `${manufacturers[profile]} ${data.value.name}`
    : manufacturers[profile],
  description: data.value && data.value.description,
  ogDescription: data.value && data.value.description,
  ogImage: data.value && data.value.img,
  twitterDescription: data.value && data.value.description,
  twitterImage: data.value && data.value.img,
})

const visible = ref(false)
const toggleShowChart = () => {
  visible.value = !visible.value
}

const showEditKeycap = ref(false)
const toggleShowEditKeycap = () => {
  showEditKeycap.value = !showEditKeycap.value
}

const keycapForm = ref()
const confirmLoading = ref(false)

const updateKeycap = async () => {
  confirmLoading.value = true

  await keycapForm.value
    .addKeycap()
    .then(() => {
      confirmLoading.value = false
      toggleShowEditKeycap()
      refresh()
    })
    .catch(() => {
      confirmLoading.value = false
    })
}

const kitSlide = ref()
const activeKitIdx = ref(0)
const activeKit = computed(() => {
  return data.value?.kits[activeKitIdx.value] || {}
})

const gotoSlide = (idx) => {
  kitSlide.value.goTo(idx)
  activeKitIdx.value = idx
}

const beforeChangeSlide = (from, to) => {
  activeKitIdx.value = to
}
</script>

<style scoped>
:deep(.slick-slide img) {
  border: 2px solid #fff;
  display: block;
  margin: auto;
  /* max-width: 80%; */
}
</style>
