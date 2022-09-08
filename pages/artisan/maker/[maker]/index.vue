<template>
  <div class="container artisan-container">
    <a-spin :spinning="pending">
      <a-page-header :title="maker.name" :avatar="{ src: maker.img }">
        <template v-if="maker.nationality" #subTitle>
          {{ getFlagEmoji(maker.nationality) }}
        </template>

        <template #extra>
          <a-button v-if="authenticated" key="sale" @click="showAddSaleModal">
            <template #icon><calendar-outlined /></template> Sales
          </a-button>
          <a-button
            v-if="authenticated"
            key="edit"
            type="primary"
            @click="showEditMakerModal"
          >
            <template #icon><edit-outlined /></template>
            Edit
          </a-button>
        </template>

        <div v-if="maker.intro">
          <p>
            {{ maker.intro }}
          </p>
        </div>

        <!-- <a-descriptions>
          <a-descriptions-item label="Catalog Last Updated">
            {{ maker.last_updated }}
          </a-descriptions-item>
        </a-descriptions> -->

        <a-row :gutter="[8, 8]" type="flex">
          <a v-if="maker.website" :href="maker.website" target="_blank">
            <a-button key="3" type="link">
              <global-outlined /> Website
            </a-button>
          </a>
          <a v-if="maker.instagram" :href="maker.instagram" target="_blank">
            <a-button key="2" type="link">
              <instagram-outlined /> Instagram
            </a-button>
          </a>
          <a v-if="maker.discord" :href="maker.discord" target="_blank">
            <a-button key="1" type="link">
              <nuxt-icon name="discord" /> Discord
            </a-button>
          </a>
          <a
            v-if="maker.artisancollector"
            :href="maker.artisancollector"
            target="_blank"
          >
            <a-button key="0" type="link">
              <nuxt-icon name="artisancollector" /> Artisan Collector
            </a-button>
          </a>
          <a :href="maker.src" target="_blank">
            <a-button v-if="maker.src" key="0" type="link">
              <file-word-outlined /> Catalog
            </a-button>
          </a>
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
            <nuxt-link :to="`/artisan/maker/${maker.id}/${sculpt.slug}`">
              <a-card hoverable :title="sculpt.name" :size="size">
                <template #cover>
                  <img
                    loading="lazy"
                    :alt="sculpt.name"
                    :src="sculpt.preview"
                  />
                </template>
              </a-card>
            </nuxt-link>
          </a-col>
        </a-row>

        <a-modal
          v-model:visible="showEditMaker"
          title="Edit Maker"
          destroy-on-close
          :confirm-loading="confirmLoading"
          @ok="updateMakerProfile"
        >
          <maker-form ref="makerForm" :is-edit="true" :metadata="maker" />
        </a-modal>

        <a-modal
          v-model:visible="showAddSale"
          title="Add Upcoming Sale"
          destroy-on-close
          :confirm-loading="confirmLoading"
          @ok="addUpcomingSale"
        >
          <sale-form ref="saleForm" :is-edit="true" :metadata="sculptLst" />
        </a-modal>
      </a-page-header>
    </a-spin>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import MakerForm from "~~/components/modals/MakerForm.vue";
import SaleForm from "~~/components/modals/SaleForm.vue";
import { useUserStore } from "~~/stores/user";

const userStore = useUserStore();
const { authenticated } = storeToRefs(userStore);

const route = useRoute();
const showEditMaker = ref(false);
const showAddSale = ref(false);

const title = ref();
useHead({ title });

const {
  data: maker,
  pending,
  refresh,
} = await useAsyncData(() => $fetch(`/api/makers/${route.params.maker}`));

watch(pending, () => {
  title.value = maker.value.name;
});
watchEffect(() => route.params.maker, refresh());

const size = "default";

const showEditMakerModal = () => {
  showEditMaker.value = !showEditMaker.value;
};

const confirmLoading = ref(false);

const makerForm = ref();
const updateMakerProfile = async () => {
  confirmLoading.value = true;

  await makerForm.value.addMaker();

  showEditMakerModal();
  confirmLoading.value = false;
};

const showAddSaleModal = () => {
  showAddSale.value = !showAddSale.value;
};

const saleForm = ref();
const addUpcomingSale = async () => {
  confirmLoading.value = true;

  await saleForm.value.addSale();

  showAddSaleModal();
  confirmLoading.value = false;
};

const sculptLst = computed(() => {
  return maker && maker.value.sculpts
    ? Object.entries(maker.value.sculpts).reduce((out, [slug, sculpt]) => {
        out[slug] = sculpt.name;
        return out;
      }, {})
    : {};
});

const getFlagEmoji = (isoCode) => {
  if (isoCode === "GB-ENG") {
    return "🏴󠁧󠁢󠁥󠁮󠁧󠁿";
  }
  if (isoCode === "GB-WLS") {
    return "🏴󠁧󠁢󠁷󠁬󠁳󠁿";
  }
  if (isoCode === "GB-SCT") {
    return "🏴󠁧󠁢󠁳󠁣󠁴󠁿";
  }
  if (isoCode === "GB-NIR") {
    // The only official flag in Northern Ireland is the Union Flag of the United Kingdom.
    return "🇬🇧";
  }

  return isoCode
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));
};
</script>

<style>
.artisan-container .nuxt-icon svg {
  margin-right: 8px;
}
</style>