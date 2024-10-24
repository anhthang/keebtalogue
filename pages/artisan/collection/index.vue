<template>
  <Panel
    header="Manage Collections"
    pt:root:class="!border-0 !bg-transparent"
    pt:title:class="flex items-center gap-4 font-medium text-3xl"
  >
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

    <Dialog
      v-model:visible="visible"
      modal
      header="Add Collection"
      class="w-[35rem]"
      dismissable-mask
    >
      <modal-collection-form :uid="user.uid" />
    </Dialog>

    <Message
      v-if="!user.email_verified"
      class="w-fit mx-auto mb-4"
      severity="info"
    >
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
        <Card class="h-full" pt:body:class="flex items-center">
          <template #title>{{ collection.name }}</template>
          <template #footer>
            <Button
              v-if="collection.published"
              text
              label="Public"
              disabled
              severity="warn"
              icon="pi pi-unlock"
            />
            <Button
              v-else
              text
              label="Private"
              disabled
              severity="secondary"
              icon="pi pi-lock"
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
</script>
