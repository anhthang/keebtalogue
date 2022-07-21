<template>
  <div class="container artisan-container">
    <a-page-header
      v-if="maker"
      :title="maker.name"
      :avatar="{ src: maker.img }"
    >
      <template v-if="maker.nationality" #subTitle>
        {{ getFlagEmoji(maker.nationality) }}
      </template>

      <template #extra>
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

      <a-row :gutter="[8, 8]" type="flex">
        <a v-if="maker.website" :href="maker.website" target="_blank">
          <a-button key="3" type="link"><global-outlined /> Website </a-button>
        </a>
        <a v-if="maker.instagram" :href="maker.instagram" target="_blank">
          <a-button key="2" type="link"
            ><instagram-outlined /> Instagram
          </a-button>
        </a>
        <a v-if="maker.discord" :href="maker.discord" target="_blank">
          <a-button key="1" type="link"
            ><aliwangwang-outlined /> Discord
          </a-button>
        </a>
        <a
          v-if="maker.artisan_collector"
          :href="maker.artisan_collector"
          target="_blank"
        >
          <a-button key="0" type="link">
            <link-outlined /> Artisan Collector
          </a-button>
        </a>
        <a :href="maker.src" target="_blank">
          <a-button v-if="maker.src" key="0" type="link">
            <file-word-outlined /> Catalog
          </a-button>
        </a>
      </a-row>
      <br />

      <a-spin :spinning="pending">
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
            <nuxt-link :to="`/artisans/maker/${maker.slug}/${sculpt.slug}`">
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
      </a-spin>

      <a-modal
        v-model:visible="showEditMaker"
        title="Edit Maker"
        destroy-on-close
        :confirm-loading="confirmLoading"
        @ok="updateMakerProfile"
      >
        <maker-form ref="makerForm" :is-edit="true" :metadata="maker" />
      </a-modal>
    </a-page-header>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import MakerForm from "~~/components/modals/MakerForm.vue";
import { useUserStore } from "~~/stores/user";

const userStore = useUserStore();
const { authenticated } = storeToRefs(userStore);

const route = useRoute();
const showEditMaker = ref(false);

const {
  data: maker,
  pending,
  refresh,
} = await useAsyncData(() =>
  Promise.all([
    $fetch(`/api/maker/${route.params.maker}`),
    $fetch("/api/firestore/query", {
      params: { col: "artisan-makers", doc: route.params.maker },
    }),
  ]).then(([maker, profile]) => {
    return {
      ...profile,
      nationality: maker.nationality,
      artisan_collector: maker.artisanCollector,
      sculpts: maker.sculpts,
    };
  })
);

watch(route.params.maker, refresh());

useHead({
  title: pending ? "Keeb Archivist" : `${maker.value.name} | Keeb Archivist`,
});

const size = "default";

const showEditMakerModal = () => {
  showEditMaker.value = !showEditMaker.value;
};

const makerForm = ref();
const confirmLoading = ref(false);
const updateMakerProfile = async () => {
  confirmLoading.value = true;

  await makerForm.value.addMaker();

  confirmLoading.value = false;
};

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
