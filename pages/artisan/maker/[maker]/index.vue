<template>
  <div class="container artisan-container">
    <a-spin :spinning="pending">
      <a-page-header
        v-if="maker"
        :title="maker.name"
        :avatar="{
          src: `/logo/${maker.id}.png`,
          shape: 'square',
          class:
            maker.invertible_logo && $colorMode.value === 'dark'
              ? 'invertible-logo'
              : '',
        }"
      >
        <template #breadcrumb>
          <a-breadcrumb>
            <a-breadcrumb-item>
              <nuxt-link to="/artisan/maker">Artisan Makers</nuxt-link>
            </a-breadcrumb-item>
            <a-breadcrumb-item>{{ maker.name }}</a-breadcrumb-item>
          </a-breadcrumb>
        </template>

        <template v-if="maker.nationality" #tags>
          {{ getFlagEmoji(maker.nationality) }}
        </template>

        <template #extra>
          <a-button
            v-if="isEditor"
            key="edit"
            type="primary"
            ghost
            @click="showEditMakerModal"
          >
            <template #icon><edit-outlined /></template>
            Edit
          </a-button>
          <a-button v-if="isEditor" key="sale" @click="showAddSaleModal">
            <template #icon><calendar-outlined /></template> Sales
          </a-button>

          <maker-helpful-links :maker="maker" />
        </template>

        <a-typography v-if="maker.intro">
          <a-typography-paragraph
            v-for="(line, idx) in maker.intro.split('\n')"
            :key="idx"
          >
            {{ line }}
          </a-typography-paragraph>
        </a-typography>

        <a-row :gutter="[8, 8]" type="flex">
          <a-col
            v-for="sculpt in maker.sculpts"
            :key="sculpt.id"
            :xs="12"
            :sm="12"
            :md="8"
            :lg="6"
            :xl="4"
          >
            <nuxt-link :to="`/artisan/maker/${maker.id}/${sculpt.sculpt_id}`">
              <a-card
                hoverable
                :title="sculpt.name"
                :head-style="artisanCardHeadStyle"
              >
                <template #cover>
                  <img loading="lazy" :alt="sculpt.name" :src="sculpt.img" />
                </template>
              </a-card>
            </nuxt-link>
          </a-col>
        </a-row>

        <a-flex justify="space-between" align="center" style="margin-top: 48px">
          <a-avatar-group class="contributors">
            <a-tooltip
              v-for="contributor in maker.contributors"
              :key="contributor.name"
              :title="contributor.name"
            >
              <a-avatar :alt="contributor.name" :src="contributor.picture" />
            </a-tooltip>
          </a-avatar-group>
          <span>
            Last updated: {{ new Date(maker.updated_at).toDateString() }}
          </span>
        </a-flex>

        <a-modal
          v-model:open="showEditMaker"
          title="Edit Maker"
          destroy-on-close
          :confirm-loading="confirmLoading"
          @ok="updateMakerProfile"
        >
          <modal-maker-form ref="makerForm" :is-edit="true" :metadata="maker" />
        </a-modal>

        <a-modal
          v-model:open="showAddSale"
          title="Add Upcoming Sale"
          destroy-on-close
          :confirm-loading="confirmLoading"
          @ok="addUpcomingSale"
        >
          <modal-sale-form
            ref="saleForm"
            :is-edit="true"
            :metadata="sculptLst"
          />
        </a-modal>
      </a-page-header>

      <back-to-artisan-makers v-else />
    </a-spin>
  </div>
</template>

<script setup>
const userStore = useUserStore()
const { isEditor } = storeToRefs(userStore)

const route = useRoute()
const showEditMaker = ref(false)
const showAddSale = ref(false)

const {
  data: maker,
  pending,
  refresh,
} = await useAsyncData(
  `maker:${route.params.maker}`,
  () => $fetch(`/api/makers/${route.params.maker}`),
  { watch: () => route.params.maker },
)

const cfg = useRuntimeConfig()

useSeoMeta({
  title: maker.value?.name,
  description: maker.value?.intro || cfg.public.appDesc,
  ogImage: `/logo/${route.params.maker}.png`,
  twitterImage: `/logo/${route.params.maker}.png`,
})

const showEditMakerModal = () => {
  showEditMaker.value = !showEditMaker.value
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
  showAddSale.value = !showAddSale.value
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

const getFlagEmoji = (isoCode) => {
  if (isoCode === 'GB-ENG') {
    return '🏴󠁧󠁢󠁥󠁮󠁧󠁿'
  }
  if (isoCode === 'GB-WLS') {
    return '🏴󠁧󠁢󠁷󠁬󠁳󠁿'
  }
  if (isoCode === 'GB-SCT') {
    return '🏴󠁧󠁢󠁳󠁣󠁴󠁿'
  }
  if (isoCode === 'GB-NIR') {
    // The only official flag in Northern Ireland is the Union Flag of the United Kingdom.
    return '🇬🇧'
  }

  return isoCode
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)))
}
</script>

<style>
.artisan-container {
  .ant-card-meta-description {
    text-align: center;
  }

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

  .anticon-custom-icon {
    vertical-align: 0.1rem;
    font-size: 16px;
  }
}

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
