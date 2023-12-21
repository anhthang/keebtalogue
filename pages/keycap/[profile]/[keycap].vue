<template>
  <div class="container artisan-container">
    <a-spin :spinning="pending">
      <a-page-header :title="data.name">
        <template #breadcrumb>
          <a-breadcrumb>
            <a-breadcrumb-item>
              <nuxt-link>Keycaps</nuxt-link>
            </a-breadcrumb-item>
            <a-breadcrumb-item>
              <nuxt-link :to="`/keycap/${data.profile_id}`">
                {{ data.profile_id.toUpperCase() }}
              </nuxt-link>
            </a-breadcrumb-item>
            <a-breadcrumb-item>{{ data.name }}</a-breadcrumb-item>
          </a-breadcrumb>
        </template>

        <template v-if="isEditor" #extra>
          <a-button type="primary" @click="toggleShowEditKit()">
            <appstore-add-outlined /> Add Kit
          </a-button>

          <a-button type="primary" ghost @click="toggleShowEditKeycap">
            <edit-outlined /> Edit
          </a-button>

          <a-button v-if="data.order_graph" @click="toggleShowGraph">
            <bar-chart-outlined /> Sales
          </a-button>

          <a v-if="data.url" :href="data.url" target="_blank">
            <a-button> <link-outlined /> Link </a-button>
          </a>
        </template>

        <a-image
          alt="Created by dvorcol"
          :width="200"
          style="display: none"
          :preview="{
            visible: showGraph,
            onVisibleChange: toggleShowGraph,
          }"
          :src="data.order_graph"
        />

        <a-modal
          v-model:open="showEditKeycap"
          title="Edit Keycap"
          destroy-on-close
          :confirm-loading="confirmLoading"
          @ok="updateKeycap"
        >
          <modal-keycap-form
            ref="keycapForm"
            :is-edit="true"
            :metadata="data"
          />
        </a-modal>

        <a-row :gutter="[8, 8]" type="flex">
          <a-col>
            <a-descriptions>
              <a-descriptions-item v-if="data.designer" label="Designer">
                {{ data.designer }}
              </a-descriptions-item>
              <a-descriptions-item v-if="data.sculpt" label="Sculpt">
                {{ data.sculpt }}
              </a-descriptions-item>
              <!-- <a-descriptions-item v-if="data.url" label="Website">
                <a :href="data.url" target="_blank">Link</a>
              </a-descriptions-item> -->
            </a-descriptions>
          </a-col>
        </a-row>

        <a-row :gutter="[8, 8]" type="flex">
          <a-col
            v-for="kit in data.kits"
            :key="kit.id"
            :xs="12"
            :sm="12"
            :md="8"
            :xl="6"
          >
            <a-card
              hoverable
              :title="kit.name"
              :head-style="artisanCardHeadStyle"
            >
              <template #cover>
                <a-image loading="lazy" :alt="kit.name" :src="kit.img" />
                <!-- <img loading="lazy" :alt="kit.name" :src="kit.img" /> -->
              </template>
              <template #actions>
                <span v-if="isEditor">
                  <edit-outlined key="edit" @click="toggleShowEditKit(kit)" />
                </span>
                <span><dollar-outlined key="price" /> {{ kit.price }} </span>
                <span><number-outlined key="qty" /> {{ kit.qty }} </span>
              </template>
            </a-card>
          </a-col>
        </a-row>

        <a-tabs v-if="false">
          <a-tab-pane
            v-for="(colorways, maker) in data.artisans"
            :key="maker"
            :tab="maker"
          >
            <a-row :gutter="[8, 8]" type="flex">
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

        <a-modal
          v-model:open="showEditKit"
          :title="selectedKit && selectedKit.id ? 'Edit Kit' : 'Add Kit'"
          destroy-on-close
          :confirm-loading="confirmLoading"
          @ok="addKeycapKit"
        >
          <modal-keycap-kit-form
            ref="keycapKitForm"
            :is-edit="selectedKit && selectedKit.id"
            :metadata="selectedKit"
          />
        </a-modal>
      </a-page-header>
    </a-spin>
  </div>
</template>

<script setup>
import groupBy from 'lodash.groupby'

const userStore = useUserStore()
const { isEditor } = storeToRefs(userStore)

const route = useRoute()

const { profile, keycap } = route.params

const { data, pending, refresh } = await useAsyncData(() =>
  $fetch(`/api/keycaps/${profile}/${keycap}`).then((data) => {
    data.artisans = groupBy(data.artisans, 'maker_name')
    return data
  }),
)

useSeoMeta({
  title: data.value.name,
})

const showGraph = ref(false)
const toggleShowGraph = () => {
  showGraph.value = !showGraph.value
}

const showEditKeycap = ref(false)
const toggleShowEditKeycap = () => {
  showEditKeycap.value = !showEditKeycap.value
}

const keycapForm = ref()
const confirmLoading = ref(false)

const updateKeycap = async () => {
  confirmLoading.value = true

  await keycapForm.value.addKeycap()

  toggleShowEditKeycap()
  confirmLoading.value = false
  refresh()
}

const showEditKit = ref(false)
const selectedKit = ref({
  profile_keycap_id: `${route.params.profile}/${route.params.keycap}`,
})

const toggleShowEditKit = (kit) => {
  showEditKit.value = !showEditKit.value
  if (kit) {
    selectedKit.value = kit
  }
}

const keycapKitForm = ref()
const addKeycapKit = async () => {
  confirmLoading.value = true

  await keycapKitForm.value.addKit()

  toggleShowEditKit()
  confirmLoading.value = false
  refresh()
}
</script>
