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
        class="overflow-hidden"
        :pt="{
          header: 'relative w-full h-44 md:h-60',
          body: 'items-center',
          caption: 'flex items-center',
          title: 'w-40 text-center truncate',
        }"
      >
        <template #header>
          <img
            loading="lazy"
            :alt="element.artisan.name"
            :src="element.artisan.img"
            class="h-full absolute inset-0 object-cover"
            :class="{
              grayscale: !element.exchange,
            }"
          />
          <span
            v-if="!element.exchange"
            class="absolute inset-0 !flex items-center justify-center !text-[120px]"
            :class="{
              'pi pi-check-circle text-green-400': buying,
              'pi pi-eye-slash text-red-600': selling,
            }"
          />
        </template>
        <template #title>{{ element.artisan.name || '-' }}</template>
        <template #subtitle>{{ element.artisan?.sculpt.name }}</template>

        <template #footer>
          <Button
            v-if="!copying"
            text
            size="small"
            severity="danger"
            label="Remove"
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
  buying: Boolean,
  selling: Boolean,
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
    header: 'Confirm to remove artisan',
    message: 'Are you sure you want to continue?',
    rejectProps: {
      size: 'small',
      label: 'Cancel',
      severity: 'secondary',
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
