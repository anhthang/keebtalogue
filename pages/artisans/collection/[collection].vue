<template>
  <div class="container artisan-container">
    <a-page-header
      :title="collection.name || 'Colllection'"
      :sub-title="sortedCollections.length"
    >
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
          <export-outlined />
          {{ collection.published ? "Republish" : "Publish" }}
        </a-button>

        <a-button
          v-if="user.emailVerified && collection.published"
          type="danger"
          @click="delPublishedCollection"
        >
          <import-outlined /> Unpublish
        </a-button>

        <a-button
          v-if="user.emailVerified"
          type="danger"
          @click="deleteCollection"
        >
          <delete-outlined /> Delete
        </a-button>
      </template>

      <a-spin :spinning="pending">
        <a-row
          v-if="collection.published && !isPublic"
          :gutter="[8, 8]"
          type="flex"
        >
          <a-col>
            This collection is published at:
            <a :href="href" target="_blank">{{ href }}</a>
          </a-col>
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
              <template v-if="!isPublic" #extra>
                <delete-outlined @click="removeCap(colorway)" />
              </template>
            </a-card>
          </a-col>
        </a-row>
      </a-spin>
    </a-page-header>
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

const collection =
  collections.value.find((c) => c.slug === route.params.collection) || {};

useHead({
  title: `${collection.name} • Collection`,
});

const isPublic = route.params.collection.startsWith("p_");
const col = isPublic
  ? "public-collections"
  : `users/${user.value.uid}/collections`;

// const { data, pending, refresh } = await useAsyncData(() =>
//   $fetch("/api/firestore/query", {
//     params: { col, doc: route.params.collection },
//   })
// );

const { data, pending, refresh } = await useAsyncData(() =>
  authenticated.value
    ? $fetch("/api/firestore/query", {
        params: { col, doc: route.params.collection },
      })
    : JSON.parse(
        localStorage.getItem(`KeebCatalogue_${route.params.collection}`) || "{}"
      )
);

watch(route.params.collection, refresh());

const sort = ref("");
watch(pending, () => {
  sortedCollections.value = Object.values(data.value);
  sort.value = "sculpt_name";
});

const size = "default";

const onChangeSortType = (e) => {
  sort.value = e.key;
};
watch(
  () => sort.value,
  () => {
    sortedCollections.value = sortBy(sortedCollections.value, [
      "maker_name",
      sort.value,
    ]);
  }
);

const cardTitle = (clw) => `${clw.name} ${clw.sculpt_name}`;

const removeCap = (clw) => {
  if (authenticated.value) {
    $fetch("/api/firestore/del", {
      params: {
        col: `users/${user.value.uid}/collections`,
        doc: route.params.collection,
        field: clw.id,
      },
    })
      .then(() => {
        refresh();
        message.success(`${cardTitle(clw)} removed from the collection.`);
      })
      .catch((error) => {
        message.error(error.message);
      });
  } else {
    sortedCollections.value = sortedCollections.value.filter(
      (c) => c.id !== clw.id
    );
    localStorage.setItem(
      `KeebCatalogue_${route.params.collection}`,
      JSON.stringify(keyBy(sortedCollections.value, "id"))
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

      $fetch("/api/firestore/del", {
        params: {
          col: `users/${user.value.uid}/collections`,
          doc: route.params.collection,
        },
      })
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
      $fetch("/api/firestore/del", {
        params: {
          col: "public-collections",
          doc: publishId.value,
        },
      })
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
      $fetch("/api/firestore/add", {
        method: "post",
        params: {
          col: "public-collections",
          doc: publishId.value,
        },
        body: keyBy(sortedCollections, "id"),
      })
        .then(() => {
          const updatedCollections = collections.map((c) => {
            if (c.slug === route.params.collection) {
              Object.assign(c, {
                published: true,
                public_id: publishId.value,
              });
              return c;
            }
          });

          $fetch("/api/firestore/put", {
            method: "post",
            params: {
              col: "users",
              doc: user.value.uid,
            },
            body: {
              collections: updatedCollections,
            },
          }).then(() => {
            message.success("Collection published");
          });
        })
        .catch((error) => {
          message.error(error.message);
        });
    },
  });
};

const publishId = computed(() => {
  const id = crc32(`${user.value.uid}__${collection.name}`).toString(16);

  return `p_${id}`;
});

const config = useRuntimeConfig();

const href = computed(() => {
  return `${config.public.baseUrl}/artisans/collection/${publishId.value}`;
});
</script>

<style lang="less">
.anticon-delete:hover {
  svg {
    fill: #f5222d;
  }
}
</style>