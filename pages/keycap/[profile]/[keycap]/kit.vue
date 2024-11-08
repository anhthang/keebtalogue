<template>
  <div>
    <PanelBreadcrumb :breadcrumbs="breadcrumbs" />

    <Panel
      header="Manage Kits"
      pt:root:class="!border-0 !bg-transparent"
      pt:title:class="flex items-center gap-4 font-medium text-3xl"
    >
      <template #icons>
        <Button label="Add" icon="pi pi-file-plus" @click="toggleEditKit()" />
      </template>

      <DataTable
        :value="data.kits"
        striped-rows
        paginator
        :rows="10"
        :always-show-paginator="false"
      >
        <Column field="name" header="Name" />
        <Column field="price" header="Price" />
        <Column field="qty" header="Quantity" />
        <Column field="img" header="Image" />
        <Column v-if="hasCancelled" field="cancelled" header="Status">
          <template #body="slotProps">
            <Tag
              v-if="slotProps.data.cancelled"
              severity="danger"
              value="Cancelled"
            />
          </template>
        </Column>
        <Column class="!text-end" header="Actions">
          <template #body="{ data: kit }">
            <div class="flex gap-2">
              <Button
                size="small"
                label="Edit"
                icon="pi pi-pen-to-square"
                severity="secondary"
                @click="toggleEditKit(kit)"
              />

              <Button
                size="small"
                label="Delete"
                icon="pi pi-trash"
                severity="danger"
                @click="confirmDelete(kit)"
              />
            </div>
          </template>
        </Column>
      </DataTable>

      <ConfirmDialog />
      <Toast />
      <Dialog
        v-model:visible="visible"
        modal
        :header="selectedKit?.id ? 'Edit Kit' : 'Add Kit'"
        dismissable-mask
        class="w-[36rem]"
      >
        <ModalKeycapKitForm
          :is-edit="!!selectedKit?.id"
          :metadata="selectedKit"
          @on-success="toggleEditKit"
        />
      </Dialog>
    </Panel>
  </div>
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

const breadcrumbs = computed(() => {
  return [
    {
      icon: 'pi pi-home',
      route: '/',
    },
    {
      label: manufacturers[profile],
      route: `/keycap/${profile}`,
    },
    {
      label: data.value.name,
      route: `/keycap/${profile}/${keycap}`,
    },
  ]
})

const hasCancelled = data.value.kits.some((k) => k.cancelled)

useSeoMeta({
  title: data.value
    ? `${manufacturers[profile]} ${data.value.name} - Manage Kits`
    : manufacturers[profile],
})

const visible = ref(false)
const selectedKit = ref({})

const toggleEditKit = (kit, shouldRefresh) => {
  visible.value = !visible.value
  selectedKit.value = kit

  if (shouldRefresh) {
    refresh()
  }
}

const confirmDelete = (kit) => {
  confirm.require({
    header: `Confirm to delete ${kit.name} kit`,
    message:
      'Are you sure you want to delete this kit? This action cannot be undone.',
    rejectProps: {
      size: 'small',
    },
    acceptProps: {
      size: 'small',
      label: 'Delete',
      severity: 'danger',
    },
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
