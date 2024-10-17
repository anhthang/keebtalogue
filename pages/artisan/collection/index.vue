<template>
  <Panel
    class="container artisan-container"
    pt:root:class="!border-0 !bg-transparent"
  >
    <template #header>
      <div
        class="flex items-center gap-4 text-2xl leading-8 text-color font-bold"
      >
        Manage Collections
      </div>
    </template>

    <template #icons>
      <div class="flex gap-2">
        <Button
          v-if="user.email_verified"
          icon="pi pi-folder-plus"
          label="Add"
          @click="showModal"
        />
      </div>
    </template>

    <a-modal
      v-model:open="visible"
      title="Add Collection"
      :confirm-loading="loading"
      @ok="addCollection"
    >
      <modal-collection-form ref="collectionForm" :uid="user.uid" />
    </a-modal>

    <Message v-if="!user.email_verified" class="mx-auto mb-4" severity="info">
      Level up your experience! Login and unlock exclusive features, unlimited
      collections, and enjoy seamless syncing across all your devices.
    </Message>

    <div
      class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4"
    >
      <nuxt-link
        v-for="collection in collections"
        :key="collection.id"
        :to="`/artisan/collection/${collection.id}`"
      >
        <Card pt:title:class="text-center" class="h-full">
          <template #title>
            {{ collection.name }}
            <Button
              v-if="collection.published"
              text
              disabled
              severity="danger"
              icon="pi pi-unlock"
            />
          </template>
        </Card>
      </nuxt-link>
    </div>
  </Panel>
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
