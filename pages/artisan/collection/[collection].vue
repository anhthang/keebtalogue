<template>
  <div class="container artisan-container">
    <a-spin :spinning="pending">
      <a-page-header :title="collection.name || 'Colllection'">
        <template #extra>
          <a-dropdown placement="bottomRight">
            <template #overlay>
              <a-menu @click="onChangeSortType">
                <a-menu-item key="sculpt_name"> Sort by Sculpt </a-menu-item>
                <a-menu-item key="name"> Sort by Colorway </a-menu-item>
              </a-menu>
            </template>
            <a-button><sort-ascending-outlined /> Sort</a-button>
          </a-dropdown>
          <a-button
            v-if="user.emailVerified"
            type="primary"
            @click="publishCollection"
          >
            <cloud-upload-outlined />
            {{ collection.published ? "Republish" : "Publish" }}
          </a-button>

          <a-button
            v-if="user.emailVerified && collection.published"
            type="danger"
            @click="delPublishedCollection"
          >
            <cloud-download-outlined /> Unpublish
          </a-button>

          <a-button
            v-if="user.emailVerified"
            type="danger"
            @click="deleteCollection"
          >
            <delete-outlined /> Delete
          </a-button>
        </template>

        <a-row v-if="collection.published" :gutter="[8, 8]" type="flex">
          <p>
            This collection is published at:
            <a :href="href" target="_blank">{{ $route.fullPath }}</a>
          </p>
        </a-row>
        <a-row :gutter="[8, 8]" type="flex">
          <a-col
            v-for="colorway in sortedCollections"
            :key="colorway.id"
            :xs="12"
            :sm="12"
            :md="8"
            :lg="6"
            :xl="4"
          >
            <a-card hoverable :title="cardTitle(colorway)" :size="size">
              <template #cover>
                <img loading="lazy" :alt="colorway.name" :src="colorway.img" />
              </template>
              <template v-if="authenticated" #extra>
                <delete-outlined @click="removeCap(colorway)" />
              </template>
            </a-card>
          </a-col>
        </a-row>
      </a-page-header>
    </a-spin>
  </div>
</template>

<script setup>
import { useUserStore } from "~~/stores/user";
import { storeToRefs } from "pinia";
import crc32 from "crc/crc32";
import { keyBy, sortBy } from "lodash";
import { message, Modal } from "ant-design-vue";

const userStore = useUserStore();
const { authenticated, collections, user } = storeToRefs(userStore);

const route = useRoute();
const router = useRouter();
const sortedCollections = ref([]);

const sort = ref("sculpt_name");
const size = "default";

const collection =
  collections.value.find((c) => c.id === route.params.collection) || {};

useHead({
  title: `${collection.name} • Collection`,
});

const { data, pending, refresh } = await useAsyncData(() => {
  if (authenticated.value) {
    return $fetch(
      `/api/users/${user.value.uid}/collections/${route.params.collection}/items`
    );
  } else if (
    route.params.collection === "wish" ||
    route.params.collection === "trade"
  ) {
    return [];
  } else {
    return $fetch(`/api/collections/${route.params.collection}`);
  }
});

onMounted(() => {
  data.value = JSON.parse(
    localStorage.getItem(`KeebArchivist_${route.params.collection}`) || "[]"
  );
});

watch(data, () => {
  sortedCollections.value = sortBy(data.value, ["maker_name", sort.value]);
});

watchEffect(() => route.params.collection, refresh());

const onChangeSortType = (e) => {
  sort.value = e.key;
};
watch(sort, () => {
  sortedCollections.value = sortBy(sortedCollections.value, [
    "maker_name",
    sort.value,
  ]);
});

const cardTitle = (clw) => `${clw.name} ${clw.sculpt_name}`;

const removeCap = (clw) => {
  if (authenticated.value) {
    $fetch(
      `/api/users/${user.value.uid}/collections/${route.params.collection}/items/${clw.id}`,
      { method: "delete" }
    )
      .then(() => {
        refresh();
        message.success(`${cardTitle(clw)} removed from the collection.`);
      })
      .catch((error) => {
        message.error(error.message);
      });
  } else {
    sortedCollections.value = sortedCollections.value.filter(
      (c) => c.colorway_id !== clw.colorway_id
    );
    localStorage.setItem(
      `KeebArchivist_${route.params.collection}`,
      JSON.stringify(sortedCollections.value)
    );

    message.success(`${cardTitle(clw)} removed from the collection.`);
  }
};

const deleteCollection = () => {
  Modal.confirm({
    title: "Are you sure to delete this collection?",
    okText: "Delete",
    onOk() {
      userStore.removeCollection(route.params.collection);

      $fetch(
        `/api/users/${user.value.uid}/collections/${route.params.collection}`,
        {
          method: "delete",
        }
      )
        .then(() => {
          message.success("Collection successfully deleted!");

          router.go(-1);
        })
        .catch((error) => {
          message.error(error.message);
        });
    },
  });
};

const delPublishedCollection = () => {
  Modal.confirm({
    title: "Are you sure to unpublish this collection?",
    onOk() {
      $fetch(
        `/api/users/${user.value.uid}/collections/${route.params.collection}`,
        {
          method: "post",
          body: {
            published: false,
          },
        }
      )
        .then(() => {
          message.success("Collection unpublished");
        })
        .catch((error) => {
          message.error(error.message);
        });
    },
  });
};

const publishCollection = () => {
  Modal.confirm({
    title: "Do you want to publish this collection?",
    okText: "Publish",
    onOk() {
      $fetch(
        `/api/users/${user.value.uid}/collections/${route.params.collection}`,
        {
          method: "post",
          body: {
            published: true,
          },
        }
      )
        .then(() => {
          message.success("Collection published");
        })
        .catch((error) => {
          message.error(error.message);
        });
    },
  });
};
</script>

<style>
.anticon-delete:hover svg {
  fill: #f5222d;
}
</style>