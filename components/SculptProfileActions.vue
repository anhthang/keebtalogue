<template>
  <div v-if="$device.isDesktopOrTablet" class="flex gap-2">
    <Button
      v-if="isEditor"
      icon="pi pi-pen-to-square"
      label="Edit"
      @click="emit('onEdit')"
    />

    <Button
      v-if="sculpt.href"
      as="a"
      icon="pi pi-external-link"
      label="Website"
      :href="sculpt.href"
      target="_blank"
      rel="noopener"
    />

    <SplitButton
      :label="sortItem.label"
      :icon="sortItem.icon"
      :model="sortOptions"
    />
  </div>
  <Button
    v-else
    aria-haspopup="true"
    aria-controls="overlay_menu"
    icon="pi pi-ellipsis-v"
    @click="toggleActions"
  >
  </Button>
  <Menu id="overlay_menu" ref="menu" :model="mobile" :popup="true" />
</template>

<script setup>
const emit = defineEmits(['onEdit', 'onSorting'])

const { sculpt } = defineProps({
  sculpt: {
    type: Object,
    default: () => ({}),
  },
})

const userStore = useUserStore()
const { isEditor } = storeToRefs(userStore)

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
      label: 'Sculpt Profile',
      visible: isEditor.value,
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
      visible: isEditor.value,
    },
    {
      label: 'Sorting',
      items: sortOptions.value,
    },
  ]
})
</script>
