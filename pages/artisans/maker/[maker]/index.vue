<template>
  <div class="container artisan-container">
    <a-page-header
      v-if="maker"
      :title="maker.name"
      :avatar="{
        props: {
          src: maker.img,
        },
      }"
    >
      <template v-if="maker.nationality" #subTitle>
        {{ getFlagEmoji(maker.nationality) }}
      </template>

      <template #extra>
        <a-button key="edit" type="primary" @click="showEditMakerModal">
          <template #icon><edit-outlined /></template>
          Edit Maker
        </a-button>
        <a v-if="maker.website" :href="maker.website" target="_blank">
          <a-button key="3"><global-outlined /> Website </a-button>
        </a>
        <a v-if="maker.instagram" :href="maker.instagram" target="_blank">
          <a-button key="2"><instagram-outlined /> Instagram </a-button>
        </a>
        <a v-if="maker.discord" :href="maker.discord" target="_blank">
          <a-button key="1"><aliwangwang-outlined /> Discord </a-button>
        </a>
        <a :href="maker.src" target="_blank">
          <a-button v-if="maker.src" key="0">
            <file-word-outlined /> Catalog
          </a-button>
        </a>
      </template>

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
        @ok="updateArtisanMaker"
      >
        <maker-form ref="artisanMaker" :is-edit="true" :metadata="maker" />
      </a-modal>
    </a-page-header>
  </div>
</template>

<script setup>
import MakerForm from "~~/components/modals/MakerForm.vue";

const route = useRoute();
const showEditMaker = ref(false);

const {
  data: maker,
  pending,
  refresh,
} = await useAsyncData(() => $fetch(`/api/maker/${route.params.maker}`));

watch(
  () => route.params.maker,
  () => refresh()
);

useHead({
  title: pending ? "Keeb Archivist" : `${maker.value.name} | Keeb Archivist`,
});

const size = "default";

const showEditMakerModal = () => {
  showEditMaker.value = !showEditMaker.value;
};

const updateArtisanMaker = () => {};

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
