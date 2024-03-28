<template>
  <div class="container artisan-container">
    <a-spin :spinning="pending">
      <a-page-header v-if="sculpt" :title="sculpt.name">
        <template #breadcrumb>
          <a-breadcrumb>
            <a-breadcrumb-item> Artisan </a-breadcrumb-item>
            <a-breadcrumb-item>
              <nuxt-link to="/artisan/maker"> Makers </nuxt-link>
            </a-breadcrumb-item>
            <a-breadcrumb-item>
              <nuxt-link :to="`/artisan/maker/${sculpt.maker_id}`">
                {{ sculpt.maker_name }}
              </nuxt-link>
            </a-breadcrumb-item>
          </a-breadcrumb>
        </template>

        <template v-if="sculpt.release" #subTitle>
          {{ sculpt.release }}
        </template>
        <template #extra>
          <!-- <a-button
            v-if="isEditor"
            key="submission"
            type="primary"
            @click="showAddColorwayModal"
          >
            <file-add-outlined /> Add
          </a-button> -->

          <a-button v-if="isEditor" @click="showEditSculptModal">
            <edit-outlined /> Edit
          </a-button>

          <a-button v-if="sculpt.href" :href="sculpt.href" target="_blank">
            <link-outlined /> Visit
          </a-button>

          <a-select v-model:value="sort">
            <a-select-option value="name|asc">
              <sort-ascending-outlined /> Name (A-Z)
            </a-select-option>
            <a-select-option value="name|desc">
              <sort-descending-outlined /> Name (Z-A)
            </a-select-option>
            <a-select-option value="order|asc">
              <ordered-list-outlined /> Oldest First
            </a-select-option>
            <a-select-option value="order|desc">
              <ordered-list-outlined /> Newest First
            </a-select-option>
          </a-select>
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

        <a-row :gutter="[16, 16]" type="flex">
          <a-col
            v-for="colorway in colorways"
            :key="colorway.colorway_id"
            :xs="12"
            :sm="12"
            :md="8"
            :lg="6"
            :xl="4"
          >
            <a-card hoverable>
              <!-- <template #extra>
                <bg-colors-outlined
                  v-if="colorway.commissioned"
                  :style="{ color: 'palevioletred' }"
                />
                <gift-filled
                  v-if="colorway.giveaway"
                  :style="{ color: 'goldenrod' }"
                />
              </template> -->
              <template #cover>
                <img
                  loading="lazy"
                  :alt="colorway.name"
                  :src="colorway.img"
                  @click="showColorwayCardModal(colorway)"
                />
              </template>

              <a-card-meta :title="colorway.name || '-'" />
            </a-card>
          </a-col>
        </a-row>

        <a-modal
          v-model:open="visible.edit"
          title="Edit Sculpt"
          destroy-on-close
          :confirm-loading="confirmLoading"
          ok-text="Save"
          @ok="updateSculptProfile"
        >
          <modal-sculpt-form
            ref="sculptForm"
            :is-edit="true"
            :metadata="sculpt"
          />
        </a-modal>

        <a-modal
          v-model:open="visible.add"
          :title="
            selectedColorway && selectedColorway.name
              ? `Edit ${colorwayTitle}`
              : 'Add Colorway'
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
          v-model:open="visible.card"
          class="colorway-card"
          :width="isShowAsMeta ? '512px' : '1024px'"
          :closable="false"
          destroy-on-close
          :footer="null"
          ok-text="Save"
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
import orderBy from 'lodash.orderby'

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

useSeoMeta({
  title: sculpt.value
    ? `${sculpt.value.name} • ${sculpt.value.maker_name}`
    : '',
  description: sculpt.value && sculpt.value.story,
  ogDescription: sculpt.value && sculpt.value.story,
  ogImage: sculpt.value && sculpt.value.img,
  twitterDescription: sculpt.value && sculpt.value.story,
  twitterImage: sculpt.value && sculpt.value.img,
})

watch(
  () => route.query.cid,
  () => {
    const clw = sculpt.value.colorways.find(
      (c) => c.colorway_id === route.query.cid,
    )
    if (clw) {
      showColorwayCardModal(clw)
    }
  },
)

onMounted(() => {
  const clw = sculpt.value.colorways.find(
    (c) => c.colorway_id === route.query.cid,
  )
  if (clw) {
    showColorwayCardModal(clw)
  }
})

const userStore = useUserStore()
const { isEditor } = storeToRefs(userStore)

const sort = ref('order|desc')

const colorways = computed(() => {
  return orderBy(sculpt.value.colorways, ...sort.value.split('|'))
})

const confirmLoading = ref(false)

const visible = ref({
  edit: false,
  add: false,
  card: false,
})

// edit sculpt
const showEditSculptModal = () => {
  visible.value.edit = !visible.value.edit
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
const showAddColorwayModal = () => {
  visible.value.add = !visible.value.add
}

const colorwayForm = ref()
const newColorwaySubmission = async () => {
  confirmLoading.value = true

  await colorwayForm.value
    .addColorway()
    .then(() => {
      confirmLoading.value = false
      showAddColorwayModal()
      refresh()
    })
    .catch(() => {
      confirmLoading.value = false
    })
}

// show colorway card popup
const selectedColorway = ref({})

const showColorwayCardModal = (clw) => {
  visible.value.card = !visible.value.card
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
