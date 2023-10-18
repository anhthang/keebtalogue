<template>
  <div class="container artisan-container">
    <a-spin :spinning="pending">
      <a-page-header
        v-if="maker"
        :title="maker.name"
        :avatar="{ src: `/logo/${$colorMode.value}/${maker.id}.png` }"
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
        </template>

        <a-typography v-if="maker.intro">
          <a-typography-paragraph>{{ maker.intro }}</a-typography-paragraph>
        </a-typography>

        <a-row :gutter="[8, 8]" type="flex">
          <a-button
            v-if="maker.website"
            key="website"
            :href="maker.website"
            target="_blank"
            type="link"
          >
            <global-outlined /> Website
          </a-button>

          <a-button
            v-if="maker.instagram"
            key="instagram"
            :href="maker.instagram"
            target="_blank"
            type="link"
          >
            <instagram-outlined /> Instagram
          </a-button>

          <a-button
            v-if="maker.discord"
            key="discord"
            :href="maker.discord"
            target="_blank"
            type="link"
          >
            <span class="anticon anticon-custom-icon">
              <icon name="la:discord" />
            </span>
            Discord
          </a-button>

          <a-button
            v-if="maker.artisancollector"
            key="artisancollector"
            :href="maker.artisancollector"
            target="_blank"
            type="link"
          >
            <span class="anticon anticon-custom-icon">
              <icon name="ArtisanCollectorIcon" size="18" />
            </span>
            Artisan Collector
          </a-button>

          <a-button
            v-if="maker.src"
            key="catalog"
            :href="maker.src"
            target="_blank"
            type="link"
          >
            <file-word-outlined /> Catalog
          </a-button>
        </a-row>
        <br />

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
              <a-card hoverable :title="sculpt.name" :size="size">
                <template #cover>
                  <img loading="lazy" :alt="sculpt.name" :src="sculpt.img" />
                </template>
              </a-card>
            </nuxt-link>
          </a-col>
        </a-row>

        <a-modal
          v-model:open="showEditMaker"
          title="Edit Maker"
          destroy-on-close
          :confirm-loading="confirmLoading"
          @ok="updateMakerProfile"
        >
          <modals-maker-form
            ref="makerForm"
            :is-edit="true"
            :metadata="maker"
          />
        </a-modal>

        <a-modal
          v-model:open="showAddSale"
          title="Add Upcoming Sale"
          destroy-on-close
          :confirm-loading="confirmLoading"
          @ok="addUpcomingSale"
        >
          <modals-sale-form
            ref="saleForm"
            :is-edit="true"
            :metadata="sculptLst"
          />
        </a-modal>
      </a-page-header>
      <a-result
        v-else
        status="404"
        title="404"
        sub-title="Sorry, we're unable to get this catalogue at the moment."
      >
        <template #extra>
          <nuxt-link to="/artisan/maker">
            <a-button type="primary">Back</a-button>
          </nuxt-link>
        </template>
      </a-result>
    </a-spin>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useUserStore } from '~~/stores/user'

const { $device } = useNuxtApp()
const { isMobile } = $device
const size = isMobile ? 'small' : 'default'

const userStore = useUserStore()
const { isEditor } = storeToRefs(userStore)

const route = useRoute()
const showEditMaker = ref(false)
const showAddSale = ref(false)

const title = ref()
const meta = ref([
  { property: 'og:image', content: `/logo/light/${route.params.maker}.png` },
  { name: 'twitter:image', content: `/logo/light/${route.params.maker}.png` },
])

useHead({ title, meta })

const {
  data: maker,
  pending,
  refresh,
} = await useAsyncData(
  () =>
    $fetch(`/api/makers/${route.params.maker}`).then((data) => {
      title.value = data.name

      if (data.intro) {
        meta.value.unshift({ name: 'description', content: data.intro })
      }

      return data
    }),
  { watch: route.params.maker },
)

const showEditMakerModal = () => {
  showEditMaker.value = !showEditMaker.value
}

const confirmLoading = ref(false)

const makerForm = ref()
const updateMakerProfile = async () => {
  confirmLoading.value = true

  await makerForm.value.addMaker()

  showEditMakerModal()
  confirmLoading.value = false
  refresh()
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
.artisan-container .anticon-custom-icon {
  vertical-align: 0.1rem;
  font-size: 16px;
}
</style>
