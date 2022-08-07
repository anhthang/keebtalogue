<template>
  <div class="container artisan-container">
    <a-spin :spinning="pending">
      <a-page-header :title="sculpt.name">
        <template #extra>
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

        <a-row :gutter="[8, 8]" type="flex">
          <a-col
            v-for="colorway in sculpt.colorways"
            :key="colorway.id"
            :xs="12"
            :sm="12"
            :md="8"
            :lg="6"
            :xl="4"
          >
            <a-card hoverable :title="colorway.name || '-'" :size="size">
              <template #extra>
                <bg-colors-outlined
                  v-if="colorway.commissioned"
                  class="commissioned"
                />
                <gift-filled
                  v-if="colorway.name.toLowerCase().includes('giveaway')"
                  class="giveaway"
                />
              </template>
              <template #cover>
                <img loading="lazy" :alt="colorway.name" :src="colorway.img" />
              </template>

              <template v-if="collections.length" #actions>
                <a-dropdown :trigger="['click']" placement="top">
                  <div><save-outlined /> Add to Collection</div>
                  <template #overlay>
                    <a-menu>
                      <a-menu-item
                        v-for="collection in collections"
                        :key="collection.slug"
                        :disabled="!collections.length"
                        @click="addToCollection(collection, colorway)"
                      >
                        {{ collection.name }}
                      </a-menu-item>
                    </a-menu>
                  </template>
                </a-dropdown>
              </template>
              <a-card-meta
                v-if="colorway.releaseDate"
                :description="colorway.releaseDate"
              />
            </a-card>
          </a-col>
        </a-row>
      </a-page-header>
    </a-spin>
  </div>
</template>

<script setup>
import { message } from "ant-design-vue";
import { sortBy } from "lodash";
import { storeToRefs } from "pinia";
import { useUserStore } from "~~/stores/user";

const route = useRoute();

const title = ref();
useHead({ title });

const {
  data: sculpt,
  pending,
  refresh,
} = await useAsyncData(() =>
  $fetch(`/api/maker/${route.params.maker}`).then((data) => {
    const sculpt = data.sculpts[route.params.sculpt];
    title.value = `${sculpt.name} • ${data.name}`;

    return sculpt;
  })
);

watchEffect(() => route.params.sculpt, refresh());

const userStore = useUserStore();
const { authenticated, collections, user } = storeToRefs(userStore);

const size = "default";
let sort = ref("order");

const onChangeSortType = (e) => {
  sort.value = e.key;
  sculpt.value.colorways = sortBy(sculpt.value.colorways, e.key);
};

const addToCollection = (collection, colorway) => {
  const clw = {
    id: colorway.id,
    name: colorway.name,
    img: colorway.img,
    sculpt_name: sculpt.value.name,
    maker_name: route.params.maker,
  };

  if (authenticated.value) {
    $fetch("/api/firestore/put", {
      method: "post",
      params: {
        col: `users/${user.value.uid}/collections`,
        doc: collection.slug,
      },
      body: {
        [colorway.id]: clw,
      },
    })
      .then(() => {
        message.success(`Added ${colorway.name} to ${collection.name}`);
      })
      .catch((error) => {
        message.error(error.message);
      });
  } else {
    const collectionMap =
      JSON.parse(localStorage.getItem(`KeebCatalogue_${collection.slug}`)) ||
      {};

    collectionMap[clw.id] = clw;

    localStorage.setItem(
      `KeebCatalogue_${collection.slug}`,
      JSON.stringify(collectionMap)
    );

    message.success(`Added ${clw.name} to ${collection.name}`);
  }
};
</script>

<style lang="less">
.commissioned {
  color: palevioletred !important;
}
.giveaway {
  color: orange !important;
}
</style>