<template>
  <div class="container artisan-container">
    <a-spin :spinning="pending">
      <a-page-header :title="sculpt.name">
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
          <a-button v-if="isEditor" type="primary" key="submission" @click="showAddColorwayModal">
            <template #icon><file-add-outlined /></template> Add
          </a-button>

          <a-button v-if="isEditor" type="primary" ghost @click="showEditSculptModal">
            <edit-outlined /> Edit
          </a-button>

          <a-button v-if="sculpt.href" :href="sculpt.href" target="_blank" type="dashed">
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
          <a-typography-paragraph v-for="(line, idx) in sculpt.story.split('\n')" :key="idx">
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
          <a-col v-for="colorway in sculpt.colorways" :key="colorway.colorway_id" :xs="12" :sm="12" :md="8" :lg="6"
            :xl="4">
            <a-card hoverable :title="colorway.name || '-'" :size="size" class="sculpt-card">
              <template #extra>
                <bg-colors-outlined v-if="colorway.commissioned" class="commissioned" />
                <gift-filled v-if="colorway.giveaway" class="giveaway" />
              </template>
              <template #cover>
                <img loading="lazy" :alt="colorway.name" :src="colorway.img"
                  @click="showColorwayInformationModal(colorway)" />
              </template>

              <template v-if="collections.length" #actions>
                <a-dropdown :trigger="['click']" placement="top">
                  <div><save-outlined /> Add to Collection</div>
                  <template #overlay>
                    <a-menu>
                      <a-menu-item v-for="collection in collections" :key="collection.id" :disabled="!collections.length"
                        @click="addToCollection(collection, colorway)">
                        {{ collection.name }}
                      </a-menu-item>
                    </a-menu>
                  </template>
                </a-dropdown>
              </template>
            </a-card>
          </a-col>
        </a-row>

        <a-modal v-model:open="showEditSculpt" title="Edit Sculpt" destroy-on-close :confirm-loading="confirmLoading"
          @ok="updateSculptProfile">
          <sculpt-form ref="sculptForm" :is-edit="true" :metadata="sculpt" />
        </a-modal>

        <a-modal v-model:open="showAddNewColorway" :title="selectedColorway && selectedColorway.name
          ? `Edit ${colorwayTitle}`
          : 'Add New Colorway'
          " destroyOnClose :confirmLoading="confirmLoading" @ok="newColorwaySubmission">
          <colorway-form ref="colorwayForm" :metadata="selectedColorway" />
        </a-modal>

        <a-modal v-model:open="showColorwayInformation" destroy-on-close :footer="null">
          <a-typography>
            <a-typography-title :level="4">
              {{ colorwayTitle }}
              <a-button v-if="isEditor" type="link" @click="onEditColorway(selectedColorway)">
                <edit-outlined />
              </a-button>
            </a-typography-title>
            <a-typography-paragraph v-if="selectedColorway.keycap">
              <a-typography-text>
                <nuxt-link :to="`/keycap/${selectedColorway.keycap.slug}`">
                  <a-tag :key="selectedColorway.keycap.id" :color="selectedColorway.keycap.base">
                    {{ selectedColorway.keycap.name }}
                  </a-tag>
                </nuxt-link>
              </a-typography-text>
            </a-typography-paragraph>

            <a-descriptions :bordered="false" :column="1" size="small">
              <a-descriptions-item label="Released">
                {{ selectedColorway.release }}
              </a-descriptions-item>
              <a-descriptions-item label="Quantity">
                {{ selectedColorway.qty }}
              </a-descriptions-item>
              <a-descriptions-item v-if="authenticated && selectedColorway.price" label="Price">
                {{ selectedColorway.currency }} {{ selectedColorway.price }}
              </a-descriptions-item>
              <a-descriptions-item v-if="authenticated && selectedColorway.sale_type" label="Sale Type">
                {{ selectedColorway.sale_type }}
              </a-descriptions-item>
            </a-descriptions>

            <a-typography-paragraph v-for="(line, idx) in descriptionLines" :key="idx">
              {{ line }}
            </a-typography-paragraph>
          </a-typography>
        </a-modal>
      </a-page-header>
    </a-spin>
  </div>
</template>

<script setup>
import { message } from "ant-design-vue";
import sortBy from "lodash.sortby";
import { storeToRefs } from "pinia";
import ColorwayForm from "~~/components/modals/ColorwayForm.vue";
import SculptForm from "~~/components/modals/SculptForm.vue";
import { useUserStore } from "~~/stores/user";

const { $device } = useNuxtApp();
const { isMobile } = $device;
const size = isMobile ? "small" : "default";

const route = useRoute();

const title = ref();
useHead({ title });

const {
  data: sculpt,
  pending,
  refresh,
} = await useAsyncData(() =>
  $fetch(
    `/api/makers/${route.params.maker}?sculpt=${route.params.sculpt}`
  ).then((data) => {
    const sculpt = data.sculpts[route.params.sculpt];

    title.value = `${sculpt.name} • ${data.name}`;
    sculpt.maker_name = data.name;

    return sculpt;
  }),
  { watch: route.params.sculpt }
);

const userStore = useUserStore();
const { authenticated, isEditor, collections, user } = storeToRefs(userStore);

let sort = ref("order");

const onChangeSortType = (e) => {
  sort.value = e.key;
  sculpt.value.colorways = sortBy(sculpt.value.colorways, e.key);
};

const addToCollection = (collection, colorway) => {
  const clw = {
    colorway_id: colorway.colorway_id,
    name: colorway.name,
    img: colorway.img,
    sculpt_name: sculpt.value.name,
    maker_id: route.params.maker,
    uid: user.value.uid,
    collection_id: collection.id,
  };

  if (authenticated.value) {
    $fetch(`/api/users/${user.value.uid}/collections/${collection.id}/items`, {
      method: "post",
      body: clw,
    })
      .then(() => {
        message.success(`Added ${colorway.name} to ${collection.name}`);
      })
      .catch((error) => {
        message.error(error.message);
      });
  } else {
    const collectionMap =
      JSON.parse(localStorage.getItem(`Keebtalogue_${collection.id}`)) || [];

    collectionMap.push(clw);

    localStorage.setItem(
      `Keebtalogue_${collection.id}`,
      JSON.stringify(collectionMap)
    );

    message.success(`Added ${clw.name} to ${collection.name}`);
  }
};

const confirmLoading = ref(false);

// edit sculpt
const showEditSculpt = ref(false);
const showEditSculptModal = () => {
  showEditSculpt.value = !showEditSculpt.value;
};

const sculptForm = ref();
const updateSculptProfile = async () => {
  confirmLoading.value = true;

  await sculptForm.value.addSculptProfile();

  showEditSculptModal();
  confirmLoading.value = false;
  refresh();
};

/**
 * New colorway submission
 * Currently, just add/update colorway description
 */
const showAddNewColorway = ref(false);
const showAddColorwayModal = () => {
  showAddNewColorway.value = !showAddNewColorway.value;
};

const colorwayForm = ref();
const newColorwaySubmission = async () => {
  confirmLoading.value = true;

  await colorwayForm.value.addColorway();
  showAddColorwayModal();

  confirmLoading.value = false;
  refresh();
};

// show colorway information popup
const showColorwayInformation = ref(false);
const selectedColorway = ref({});
const descriptionLines = ref([]);
const showColorwayInformationModal = (clw) => {
  showColorwayInformation.value = !showColorwayInformation.value;
  selectedColorway.value = clw;
  if (clw.description) {
    descriptionLines.value = clw.description.split("\n");
  } else {
    descriptionLines.value = [];
  }
};

const colorwayTitle = computed(() => {
  return `${selectedColorway.value.name} ${sculpt.value.name}`;
});

// edit colorway
const onEditColorway = (clw) => {
  showColorwayInformationModal(clw);
  showAddColorwayModal();
};
</script>

<style>
.giveaway {
  color: orange;
}

.commissioned {
  color: palevioletred;
}
</style>
