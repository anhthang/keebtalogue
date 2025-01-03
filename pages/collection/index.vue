<template>
  <Panel
    header="My Collections"
    pt:root:class="!border-0 !bg-transparent"
    pt:title:class="flex items-center gap-4 font-medium text-3xl"
  >
    <template #icons>
      <div class="flex gap-2">
        <Button
          v-if="authenticated"
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

    <DataView
      :value="collections"
      layout="grid"
      paginator
      :rows="60"
      :total-records="collections.length"
      :always-show-paginator="false"
      :pt="{
        content: '!bg-transparent',
        pcPaginator: {
          paginatorContainer: '!border-0 pt-4',
          root: '!bg-transparent',
        },
      }"
    >
      <template #grid="{ items }">
        <div
          class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6 gap-4"
        >
          <nuxt-link
            v-for="collection in items"
            :key="collection.id"
            :to="`/collection/${collection.category}/${collection.id}`"
          >
            <Card
              class="h-full"
              pt:title:class="flex items-center justify-between"
            >
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
              <template v-if="authenticated" #subtitle>
                {{ collection.total_items }} items
              </template>
            </Card>
          </nuxt-link>
        </div>
      </template>
    </DataView>
  </Panel>
</template>

<script setup>
useSeoMeta({
  title: 'My Collections',
})

const userStore = useUserStore()
const { authenticated, user, collections } = storeToRefs(userStore)

const visible = ref(false)
const toggleAddCollection = () => {
  visible.value = !visible.value
}
</script>
