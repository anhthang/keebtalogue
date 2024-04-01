<template>
  <a-page-header title="Manage Collections" class="container artisan-container">
    <template #extra>
      <a-button v-if="user.email_verified" type="primary" @click="showModal">
        <file-add-outlined /> Add
      </a-button>
    </template>
    <a-modal
      v-model:open="visible"
      title="Add Collection"
      :confirm-loading="loading"
      @ok="addCollection"
    >
      <modal-collection-form ref="collectionForm" :uid="user.uid" />
    </a-modal>

    <a-row v-if="!user.email_verified" type="flex">
      <a-alert
        class="alert-banner"
        type="info"
        message="Level up your experience! Login and unlock exclusive features, unlimited collections, and enjoy seamless syncing across all your devices."
        banner
      />
    </a-row>

    <a-row :gutter="[16, 16]" type="flex">
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
          <a-card
            hoverable
            :title="collection.name"
            :head-style="{ textAlign: 'center' }"
          >
            <template v-if="collection.published" #extra>
              <a-button type="link" danger>
                <unlock-outlined />
              </a-button>
            </template>
          </a-card>
        </nuxt-link>
      </a-col>
    </a-row>
  </a-page-header>
</template>

<script setup>
useSeoMeta({
  title: 'Manage Collections',
})

const userStore = useUserStore()
const { user, collections } = storeToRefs(userStore)

const visible = ref(false)
const showModal = () => {
  visible.value = !visible.value
}

const loading = ref(false)
const collectionForm = ref()
const addCollection = async () => {
  loading.value = true

  await collectionForm.value
    .addCollection()
    .then(() => {
      loading.value = false
      showModal()
    })
    .catch(() => {
      loading.value = false
    })
}
</script>
