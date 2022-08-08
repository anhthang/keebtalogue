<template>
  <div class="container artisan-container">
    <a-page-header title="Collection">
      <template #extra>
        <a-button v-if="user.emailVerified" type="primary" @click="showModal">
          <file-add-outlined /> Add
        </a-button>
      </template>
      <a-modal
        v-model:visible="visible"
        title="New Collection"
        @ok="addCollection"
      >
        <a-input v-model:value="collectionName" placeholder="Collection Name" />
      </a-modal>

      <a-row v-if="!user.emailVerified" type="flex">
        <a-alert
          class="collection-alert"
          message="You must log in to use this feature and sync the collections across your devices."
          banner
        />
      </a-row>

      <a-row :gutter="[8, 8]" type="flex">
        <a-col
          v-for="collection in collections"
          :key="collection.slug"
          :xs="12"
          :sm="12"
          :md="8"
          :lg="6"
          :xl="4"
        >
          <nuxt-link :to="`/artisan/collection/${collection.slug}`">
            <a-card hoverable :title="collection.name" />
          </nuxt-link>
        </a-col>
      </a-row>
    </a-page-header>
  </div>
</template>

<script setup>
import { useUserStore } from "~~/stores/user";
import { storeToRefs } from "pinia";
import slugify from "slugify";
import { message } from "ant-design-vue";

useHead({
  title: "Collection",
});

const userStore = useUserStore();
const { user, collections } = storeToRefs(userStore);

const visible = ref(false);
const showModal = () => {
  visible.value = !visible.value;
};

const collectionName = ref("");
const addCollection = async () => {
  const slug = slugify(collectionName.value, { lower: true });

  const isExist = collections.value.find((c) => c.slug === slug);
  if (isExist) {
    message.error("Collection already exist.");
    return;
  }

  userStore.addCollection(collectionName.value, slug);

  $fetch("/api/firestore/add", {
    method: "post",
    params: {
      col: `users/${user.value.uid}/collections`,
      doc: slug,
    },
    body: {},
  })
    .then(() => {
      message.success("Added new collection");
      showModal();
    })
    .catch((error) => {
      message.error(error.message);
    });
};
</script>

<style>
.collection-alert {
  margin: 0 auto;
  margin-bottom: 16px;
}
</style>
