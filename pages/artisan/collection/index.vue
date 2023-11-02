<template>
  <div class="container artisan-container">
    <a-page-header title="Collection">
      <template #extra>
        <a-button v-if="user.email_verified" type="primary" @click="showModal">
          <file-add-outlined /> Add
        </a-button>
      </template>
      <a-modal
        v-model:open="visible"
        title="New Collection"
        :confirm-loading="loading"
        @ok="addCollection"
      >
        <a-input v-model:value="collectionName" placeholder="Collection Name" />
      </a-modal>

      <a-row v-if="!user.email_verified" type="flex">
        <a-alert
          class="collection-alert"
          message="You must log in to use this feature and sync the collections across your devices."
          banner
        />
      </a-row>

      <a-row :gutter="[8, 8]" type="flex">
        <a-col
          v-for="collection in collections"
          :key="collection.id"
          :xs="12"
          :sm="12"
          :md="8"
          :lg="6"
          :xl="4"
        >
          <nuxt-link :to="`/artisan/collection/${collection.id}`">
            <a-card hoverable :title="collection.name" />
          </nuxt-link>
        </a-col>
      </a-row>
    </a-page-header>
  </div>
</template>

<script setup>
import { useUserStore } from '~~/stores/user'
import { storeToRefs } from 'pinia'
import { message } from 'ant-design-vue'

useSeoMeta({
  title: 'Collection',
})

const userStore = useUserStore()
const { user, collections } = storeToRefs(userStore)

const visible = ref(false)
const showModal = () => {
  visible.value = !visible.value
}

const collectionName = ref('')
const loading = ref(false)

const addCollection = async () => {
  loading.value = true
  await $fetch(`/api/users/${user.value.uid}/collections`, {
    method: 'post',
    body: {
      name: collectionName.value,
      uid: user.value.uid,
    },
  })
    .then(() => {
      message.success(
        `Collection [${collectionName.value}] added successfully!`,
      )
      userStore.getUserDocument(user.value.uid)
      showModal()
    })
    .catch((error) => {
      message.error(error.message)
    })

  loading.value = false
}
</script>

<style>
.collection-alert {
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 1rem;
}
</style>
