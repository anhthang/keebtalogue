<template>
  <div v-if="$device.isDesktopOrTablet" class="flex gap-2">
    <Button
      v-if="editable"
      icon="pi pi-pen-to-square"
      label="Edit"
      severity="secondary"
      @click="emit('onEdit')"
    />

    <Button
      v-if="sculpt.href"
      as="a"
      icon="pi pi-external-link"
      label="Website"
      severity="secondary"
      :href="sculpt.href"
      target="_blank"
      rel="noopener"
    />

    <SplitButton
      :icon="sortItem.icon"
      :label="sortItem.label"
      severity="secondary"
      :model="sortOptions"
    />
  </div>
  <Button
    v-else
    aria-haspopup="true"
    aria-controls="overlay_menu"
    icon="pi pi-ellipsis-v"
    severity="secondary"
    @click="toggleActions"
  >
  </Button>
  <Menu id="overlay_menu" ref="menu" :model="mobile" :popup="true" />
</template>

<script setup>
const emit = defineEmits(['onEdit', 'onSorting'])

const { sculpt, editable } = defineProps({
  sculpt: {
    type: Object,
    default: () => ({}),
  },
  editable: Boolean,
})

const menu = ref()
const toggleActions = (event) => {
  menu.value.toggle(event)
}

const sort = ref('order|desc')
const sortItem = ref({
  label: 'Newest First',
  icon: 'pi pi-sort-numeric-down-alt',
})

const sortOptions = computed(() => [
  {
    label: 'Name (A-Z)',
    icon: 'pi pi-sort-alpha-down',
    class: sort.value === 'name|asc' && activePopMenu,
    command: ({ item }) => {
      sort.value = 'name|asc'
      sortItem.value = item
      emit('onSorting', 'name|asc')
    },
  },
  {
    label: 'Name (Z-A)',
    icon: 'pi pi-sort-alpha-down-alt',
    class: sort.value === 'name|desc' && activePopMenu,
    command: ({ item }) => {
      sort.value = 'name|desc'
      sortItem.value = item
      emit('onSorting', 'name|desc')
    },
  },
  {
    label: 'Oldest First',
    icon: 'pi pi-sort-numeric-down',
    class: sort.value === 'order|asc' && activePopMenu,
    command: ({ item }) => {
      sort.value = 'order|asc'
      sortItem.value = item
      emit('onSorting', 'order|asc')
    },
  },
  {
    label: 'Newest First',
    icon: 'pi pi-sort-numeric-down-alt',
    class: sort.value === 'order|desc' && activePopMenu,
    command: ({ item }) => {
      sort.value = 'order|desc'
      sortItem.value = item
      emit('onSorting', 'order|desc')
    },
  },
])

const mobile = computed(() => {
  return [
    {
      label: 'Editing',
      visible: editable,
      items: [
        {
          label: 'Edit',
          icon: 'pi pi-pen-to-square',
          command: () => {
            emit('onEdit')
          },
        },
      ],
    },
    {
      separator: true,
      visible: editable,
    },
    {
      label: 'Sorting',
      items: sortOptions.value,
    },
  ]
})
</script>
