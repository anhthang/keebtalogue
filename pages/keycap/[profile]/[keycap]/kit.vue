<template>
  <Panel
    header="Manage Kits"
    pt:root:class="!border-0 !bg-transparent"
    pt:title:class="flex items-center gap-4 font-medium text-3xl"
  >
    <template #icons>
      <Button label="Add" icon="pi pi-file-plus" @click="toggleShowEditKit()" />
    </template>

    <DataTable
      :value="data.kits"
      striped-rows
      :paginator="data.kits >= 10"
      :rows="10"
    >
      <Column field="name" header="Name" />
      <Column field="price" header="Price" />
      <Column field="qty" header="Quantity" />
      <Column field="img" header="Image" />
      <!-- <Column field="cancelled" header="Status" /> -->
      <Column class="!text-end" header="Actions">
        <template #body="{ data: kit }">
          <div class="flex gap-2">
            <Button
              label="Edit"
              icon="pi pi-pen-to-square"
              severity="secondary"
              @click="toggleShowEditKit(kit)"
            />

            <Button
              v-if="data.status === 'Interest Check'"
              label="Delete"
              icon="pi pi-trash"
              severity="danger"
              @click="showConfirmDelete(kit)"
            />
          </div>
        </template>
      </Column>
    </DataTable>

    <ConfirmDialog />
    <Toast />
    <Dialog
      v-model:visible="showEditKit"
      modal
      :header="selectedKit?.id ? 'Edit Kit' : 'Add Kit'"
      dismissable-mask
      class="w-[35rem]"
    >
      <ModalKeycapKitForm
        :is-edit="!!selectedKit?.id"
        :metadata="selectedKit"
        @on-success="toggleShowEditKit"
      />
    </Dialog>
  </Panel>
</template>

<script setup>
definePageMeta({
  middleware: 'auth',
})

const confirm = useConfirm()
const toast = useToast()

const route = useRoute()
const { profile, keycap } = route.params

const { data, refresh } = await useAsyncData(
  `keycap/${profile}/${keycap}`,
  () => $fetch(`/api/keycaps/${profile}/${keycap}`),
)

useSeoMeta({
  title: data.value
    ? `${manufacturers[profile]} ${data.value.name} - Manage Kits`
    : manufacturers[profile],
})

const showEditKit = ref(false)
const selectedKit = ref({})

const toggleShowEditKit = (kit, shouldRefresh) => {
  showEditKit.value = !showEditKit.value
  selectedKit.value = kit

  if (shouldRefresh) {
    refresh()
  }
}

const showConfirmDelete = (kit) => {
  confirm.require({
    header: `Confirm to delete ${kit.name} kit`,
    message:
      'Are you sure you want to delete this kit? This action cannot be undone.',
    acceptLabel: 'Delete',
    acceptProps: { severity: 'danger' },
    accept: () => {
      $fetch(`/api/keycaps/${kit.profile_keycap_id}/kits/${kit.id}`, {
        method: 'delete',
      })
        .then(() => {
          toast.add({
            severity: 'success',
            summary: `Kit [${kit.name}] was deleted.`,
            life: 3000,
          })
          refresh()
        })
        .catch((error) => {
          toast.add({ severity: 'error', summary: error.message, life: 3000 })
        })
    },
  })
}
</script>
