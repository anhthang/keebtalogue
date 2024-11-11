<template>
  <draggable
    :list="wishlist"
    item-key="id"
    group="group"
    class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6 gap-4"
  >
    <template #item="{ element }">
      <Card
        :key="element.element_id"
        class="flex items-center flex-1 overflow-hidden"
        :pt="{
          header: 'w-full h-44 md:h-60',
          body: 'items-center',
          caption: 'flex items-center',
          title: 'w-40 text-center truncate',
        }"
      >
        <template #header>
          <img
            loading="lazy"
            :alt="element.name"
            :src="element.img"
            class="h-full object-cover"
          />
        </template>
        <template #title>{{ element.name || '-' }}</template>
        <template #subtitle>{{ element.sculpt_name }}</template>

        <template #footer>
          <Button
            v-if="!copying"
            text
            size="small"
            severity="danger"
            label="Remove"
            icon="pi pi-trash"
            @click="remove(element)"
          />
        </template>
      </Card>
    </template>
  </draggable>

  <ConfirmDialog />
</template>

<script setup>
import draggable from 'vuedraggable'

const wishlist = ref([])

const { data } = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
  copying: Boolean,
})

onBeforeMount(() => {
  wishlist.value = data
})

watch(
  () => data,
  () => {
    wishlist.value = data
  },
)

const confirm = useConfirm()

const remove = (item) => {
  confirm.require({
    header: 'Remove Artisan',
    message: 'Are you sure you want to continue?',
    rejectProps: {
      size: 'small',
    },
    acceptProps: {
      size: 'small',
      label: 'Remove',
      severity: 'danger',
    },
    accept: () => {
      wishlist.value = wishlist.value.filter((c) => c.id !== item.id)
    },
  })
}
</script>
