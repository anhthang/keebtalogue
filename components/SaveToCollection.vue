<template>
  <Button
    v-tooltip.top="label ? false : action"
    :text="text"
    size="small"
    :label="label"
    severity="secondary"
    :icon="move ? 'pi pi-file-export' : 'pi pi-bookmark'"
    aria-haspopup="true"
    aria-controls="overlay_menu"
    :fluid="fluid"
    @click="toggle"
  />
  <Menu
    id="overlay_menu"
    ref="menu"
    :popup="true"
    :model="[
      {
        label: `${action} to Collection`,
        items: collections
          .filter((c) => c.category === category)
          .map((collection) => ({
            label: collection.name,
            command: () => {
              $emit('onSelect', collection, item)
            },
          })),
      },
    ]"
  />
</template>

<script setup>
defineEmits(['onSelect'])

const { move } = defineProps({
  item: {
    type: Object,
    default: () => ({}),
  },
  category: {
    type: String,
    default: 'artisan',
  },
  text: Boolean,
  fluid: Boolean,
  move: Boolean,
  label: {
    type: String,
    default: undefined,
  },
})

const action = move ? 'Move' : 'Save'

const userStore = useUserStore()
const { collections } = storeToRefs(userStore)

const menu = ref()
const toggle = (event) => {
  event.preventDefault()

  menu.value.toggle(event)
}
</script>
