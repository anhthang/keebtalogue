<template>
  <div class="container artisan-container">
    <a-spin :spinning="pending">
      <a-page-header v-if="sculpt" :title="sculpt.name">
        <template #breadcrumb>
          <a-breadcrumb>
            <a-breadcrumb-item>
              <nuxt-link to="/artisan/maker">Artisan Makers</nuxt-link>
            </a-breadcrumb-item>
            <a-breadcrumb-item>
              <nuxt-link :to="`/artisan/maker/${sculpt.maker_id}`">
                {{ sculpt.maker_name }}
              </nuxt-link>
            </a-breadcrumb-item>
            <a-breadcrumb-item>{{ sculpt.name }}</a-breadcrumb-item>
          </a-breadcrumb>
        </template>

        <template v-if="sculpt.release" #subTitle>
          {{ sculpt.release }}
        </template>
        <template #extra>
          <a-button
            v-if="isEditor"
            key="submission"
            type="primary"
            @click="showAddColorwayModal"
          >
            <template #icon><file-add-outlined /></template> Add
          </a-button>

          <a-button
            v-if="isEditor"
            type="primary"
            ghost
            @click="showEditSculptModal"
          >
            <edit-outlined /> Edit
          </a-button>

          <a-button
            v-if="sculpt.href"
            :href="sculpt.href"
            target="_blank"
            type="dashed"
          >
            <link-outlined /> Visit
          </a-button>

          <a-dropdown placement="bottomRight">
            <template #overlay>
              <a-menu @click="onChangeSortType">
                <a-menu-item key="name">
                  <sort-ascending-outlined /> Name
                </a-menu-item>
                <a-menu-item key="order">
                  <ordered-list-outlined /> Order
                </a-menu-item>
              </a-menu>
            </template>
            <a-button>
              <sort-ascending-outlined v-if="sort === 'name'" />
              <ordered-list-outlined v-else /> Sort
            </a-button>
          </a-dropdown>
        </template>

        <a-typography v-if="sculpt.story">
          <a-typography-paragraph
            v-for="(line, idx) in sculpt.story.split('\n')"
            :key="idx"
          >
            {{ line }}
          </a-typography-paragraph>
        </a-typography>

        <a-descriptions>
          <a-descriptions-item v-if="sculpt.profile" label="Profile">
            {{ sculpt.profile }}
          </a-descriptions-item>
          <a-descriptions-item v-if="sculpt.design" label="Design">
            {{ sculpt.design }}
          </a-descriptions-item>
          <a-descriptions-item v-if="sculpt.cast" label="Cast">
            {{ sculpt.cast }}
          </a-descriptions-item>
        </a-descriptions>

        <a-row :gutter="[8, 8]" type="flex">
          <a-col
            v-for="colorway in sculpt.colorways"
            :key="colorway.colorway_id"
            :xs="12"
            :sm="12"
            :md="8"
            :lg="6"
            :xl="4"
          >
            <a-card
              hoverable
              :title="colorway.name || '-'"
              :head-style="artisanCardHeadStyle"
            >
              <template #extra>
                <bg-colors-outlined
                  v-if="colorway.commissioned"
                  :style="{ color: 'palevioletred' }"
                />
                <gift-filled
                  v-if="colorway.giveaway"
                  :style="{ color: 'goldenrod' }"
                />
              </template>
              <template #cover>
                <img
                  loading="lazy"
                  :alt="colorway.name"
                  :src="colorway.img"
                  @click="showColorwayCardModal(colorway)"
                />
              </template>
            </a-card>
          </a-col>
        </a-row>

        <a-modal
          v-model:open="showEditSculpt"
          title="Edit Sculpt"
          destroy-on-close
          :confirm-loading="confirmLoading"
          @ok="updateSculptProfile"
        >
          <modal-sculpt-form
            ref="sculptForm"
            :is-edit="true"
            :metadata="sculpt"
          />
        </a-modal>

        <a-modal
          v-model:open="showAddNewColorway"
          :title="
            selectedColorway && selectedColorway.name
              ? `Edit ${colorwayTitle}`
              : 'Add New Colorway'
          "
          destroy-on-close
          :confirm-loading="confirmLoading"
          @ok="newColorwaySubmission"
        >
          <modal-colorway-form
            ref="colorwayForm"
            :metadata="selectedColorway"
          />
        </a-modal>

        <a-modal
          v-model:open="showColorwayCard"
          class="colorway-card"
          :width="isShowAsMeta ? '512px' : '1024px'"
          :closable="false"
          destroy-on-close
          :footer="null"
        >
          <modal-colorway-card
            :colorway="selectedColorway"
            @edit-colorway="toggleEditColorway"
          />
        </a-modal>
      </a-page-header>

      <back-to-artisan-makers v-else />
    </a-spin>
  </div>
</template>

<script setup>
import sortBy from 'lodash.sortby'
import { storeToRefs } from 'pinia'
import { useUserStore } from '~~/stores/user'

const route = useRoute()
const { isMobile } = useDevice()

const {
  data: sculpt,
  pending,
  refresh,
} = await useAsyncData(
  `maker:${route.params.maker}:${route.params.sculpt}`,
  () =>
    $fetch(`/api/makers/${route.params.maker}?sculpt=${route.params.sculpt}`),
  {
    watch: () => route.params.sculpt,
    transform: (data) => {
      const sculpt = data.sculpts[route.params.sculpt]

      sculpt.maker_name = data.name

      return sculpt
    },
  },
)

const cfg = useRuntimeConfig()

useSeoMeta({
  title: sculpt.value
    ? `${sculpt.value.name} • ${sculpt.value.maker_name}`
    : '',
  description: sculpt.value?.story || cfg.public.appDesc,
  ogImage: sculpt.value?.img || `${cfg.app.baseURL}/website-card.png`,
  twitterImage: sculpt.value?.img || `${cfg.app.baseURL}/website-card.png`,
})

const userStore = useUserStore()
const { isEditor } = storeToRefs(userStore)

const sort = ref('order')

const onChangeSortType = (e) => {
  sort.value = e.key
  sculpt.value.colorways = sortBy(sculpt.value.colorways, e.key)
}

const confirmLoading = ref(false)

// edit sculpt
const showEditSculpt = ref(false)
const showEditSculptModal = () => {
  showEditSculpt.value = !showEditSculpt.value
}

const sculptForm = ref()
const updateSculptProfile = async () => {
  confirmLoading.value = true

  await sculptForm.value.addSculptProfile()

  showEditSculptModal()
  confirmLoading.value = false
  refresh()
}

/**
 * New colorway submission
 * Currently, just add/update colorway description
 */
const showAddNewColorway = ref(false)
const showAddColorwayModal = () => {
  showAddNewColorway.value = !showAddNewColorway.value
}

const colorwayForm = ref()
const newColorwaySubmission = async () => {
  confirmLoading.value = true

  await colorwayForm.value.addColorway()
  showAddColorwayModal()

  confirmLoading.value = false
  refresh()
}

// show colorway card popup
const showColorwayCard = ref(false)
const selectedColorway = ref({})

const showColorwayCardModal = (clw) => {
  showColorwayCard.value = !showColorwayCard.value
  selectedColorway.value = clw
  selectedColorway.value.sculpt_name = sculpt.value.name
}

const colorwayTitle = computed(() => {
  return `${selectedColorway.value.name} ${sculpt.value.name}`
})

const isShowAsMeta = computed(() => {
  return isMobile || !selectedColorway.value.description
})

// edit colorway
const toggleEditColorway = () => {
  showColorwayCardModal(selectedColorway.value)
  showAddColorwayModal()
}
</script>
