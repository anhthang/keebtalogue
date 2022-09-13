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

          <a-button
            v-if="authenticated"
            key="desc"
            @click="showAddColorwayDescModal"
          >
            <template #icon><info-circle-outlined /></template> Description
          </a-button>
          <a-button
            v-if="authenticated"
            key="edit"
            type="primary"
            @click="showEditSculptModal"
          >
            <template #icon><edit-outlined /></template>
            Edit
          </a-button>
        </template>

        <div v-if="sculpt.story" class="sculpt-description">
          <p>
            {{ sculpt.story }}
            <br />
            <a v-if="sculpt.href" :href="sculpt.href" target="_blank">
              Read more
            </a>
          </p>
        </div>

        <a-descriptions>
          <a-descriptions-item v-if="sculpt.releaseDate" label="Release">
            {{ sculpt.releaseDate }}
          </a-descriptions-item>
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
            :key="colorway.id"
            :xs="12"
            :sm="12"
            :md="8"
            :lg="6"
            :xl="4"
          >
            <a-card
              hoverable
              :title="colorway.name || '-'"
              :size="size"
              class="sculpt-card"
            >
              <template #extra>
                <bg-colors-outlined
                  v-if="colorway.commissioned"
                  class="commissioned"
                />
                <gift-two-tone
                  v-if="colorway.giveaway"
                  two-tone-color="orange"
                />
              </template>
              <template #cover>
                <img
                  loading="lazy"
                  :alt="colorway.name"
                  :src="colorway.img"
                  @click="showColorwayInformationModal(colorway)"
                />
              </template>

              <template v-if="collections.length" #actions>
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
              </template>
              <a-card-meta v-if="isShowDescription">
                <template #description>
                  <a-list-item>
                    <span>
                      <calendar-outlined /> {{ colorway.releaseDate }}
                    </span>
                    <span v-if="colorway.totalCount == 1">
                      <field-binary-outlined class="one-off" />
                    </span>
                    <span v-else>
                      <field-number-outlined /> {{ colorway.totalCount }}
                    </span>
                  </a-list-item>
                </template>
              </a-card-meta>
            </a-card>
          </a-col>
        </a-row>

        <a-modal
          v-model:visible="showEditSculpt"
          title="Edit Sculpt"
          destroy-on-close
          :confirm-loading="confirmLoading"
          @ok="updateSculptProfile"
        >
          <sculpt-form ref="sculptForm" :is-edit="true" :metadata="sculpt" />
        </a-modal>

        <a-modal
          v-model:visible="showAddColorwayDesc"
          title="Add Colorway Information"
          destroyOnClose
          :confirmLoading="confirmLoading"
          @ok="addColorwayDesc"
        >
          <colorway-form ref="colorwayForm" :metadata="sculpt.colorways" />
        </a-modal>

        <a-modal
          v-model:visible="showColorwayInformation"
          destroy-on-close
          :footer="null"
        >
          <a-descriptions :title="selectedColorway.name">
            <a-descriptions-item
              v-if="selectedColorway.description"
              class="colorway-description"
            >
              {{ selectedColorway.description }}
            </a-descriptions-item>
            <a-descriptions-item v-else>
              <i>Updating...</i>
            </a-descriptions-item>
          </a-descriptions>
        </a-modal>
      </a-page-header>
    </a-spin>
  </div>
</template>

<script setup>
import { message } from "ant-design-vue";
import { sortBy } from "lodash";
import { storeToRefs } from "pinia";
import ColorwayForm from "~~/components/modals/ColorwayForm.vue";
import SculptForm from "~~/components/modals/SculptForm.vue";
import { useUserStore } from "~~/stores/user";

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
    colorway_id: colorway.id,
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
      JSON.parse(localStorage.getItem(`KeebArchivist_${collection.id}`)) || [];

    collectionMap.push(clw);

    localStorage.setItem(
      `KeebArchivist_${collection.id}`,
      JSON.stringify(collectionMap)
    );

    message.success(`Added ${clw.name} to ${collection.name}`);
  }
};

const isShowDescription = computed(() => {
  const release = sculpt.value.colorways.filter((c) => c.releaseDate).length;
  const count = sculpt.value.colorways.filter((c) => c.totalCount).length;

  return release || count;
});

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
};

// add colorway information
const showAddColorwayDesc = ref(false);
const showAddColorwayDescModal = () => {
  showAddColorwayDesc.value = !showAddColorwayDesc.value;
};

const colorwayForm = ref();
const addColorwayDesc = async () => {
  confirmLoading.value = true;

  await colorwayForm.value.addColorwayInformation();
  showAddColorwayDescModal();

  confirmLoading.value = false;
};

// show colorway information popup
const showColorwayInformation = ref(false);
const selectedColorway = ref({});
const showColorwayInformationModal = (clw) => {
  showColorwayInformation.value = !showColorwayInformation.value;
  selectedColorway.value = clw;
};
</script>

<style>
.one-off {
  color: goldenrod;
  font-size: 18px;
}

.commissioned {
  color: palevioletred;
}

.sculpt-card .ant-card-body {
  padding: 12px 24px;
}

.colorway-description,
.sculpt-description {
  white-space: pre-wrap;
  text-align: justify;
}
</style>