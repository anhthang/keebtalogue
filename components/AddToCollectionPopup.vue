<template>
  <Button
    v-tooltip.top="label ? false : 'Add to Collection'"
    :text="text"
    size="small"
    :label="label"
    severity="secondary"
    icon="pi pi-folder-plus"
    aria-haspopup="true"
    aria-controls="overlay_menu"
    @click="toggle"
  />
  <Menu
    id="overlay_menu"
    ref="menu"
    :popup="true"
    :model="[
      {
        label: 'Select Collection',
        items: collections.map((collection) => ({
          label: collection.name,
          command: () => {
            $emit('onSelect', collection, colorway)
          },
        })),
      },
    ]"
  />
</template>

<script setup>
defineEmits(['onSelect'])

defineProps({
  colorway: {
    type: Object,
    default: () => ({}),
  },
  text: Boolean,
  label: {
    type: String,
    default: undefined,
  },
})

const userStore = useUserStore()
const { collections } = storeToRefs(userStore)

const menu = ref()
const toggle = (event) => {
  menu.value.toggle(event)
}
</script>
