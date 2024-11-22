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
          @click="toggleAddCollection"
        />
      </div>
    </template>

    <Dialog
      v-model:visible="visible"
      modal
      header="Add Collection"
      class="w-[36rem]"
      dismissable-mask
    >
      <ModalCollectionForm :uid="user.uid" @on-success="toggleAddCollection" />
    </Dialog>

    <Message
      v-if="!user.email_verified"
      class="w-fit mx-auto mb-4"
      severity="info"
      icon="pi pi-info-circle"
    >
      Level up your experience! Login and unlock exclusive features, unlimited
      collections, and enjoy seamless syncing across all your devices.
    </Message>

    <div
      class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6 gap-4"
    >
      <nuxt-link
        v-for="collection in collections"
        :key="collection.id"
        :to="`/artisan/collection/${collection.id}`"
      >
        <Card class="h-full" pt:title:class="flex items-center justify-between">
          <template #title>
            {{ collection.name }}

            <Message
              v-if="collection.published"
              size="small"
              variant="simple"
              severity="warn"
              icon="pi pi-unlock"
            />
            <Message
              v-else
              size="small"
              variant="simple"
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
const toggleAddCollection = () => {
  visible.value = !visible.value
}
</script>
