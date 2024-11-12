<template>
  <div v-if="$device.isDesktopOrTablet" class="flex gap-2">
    <Button
      v-if="isEditor"
      icon="pi pi-pen-to-square"
      label="Edit"
      @click="emit('onEditMaker')"
    />

    <Button
      v-if="isEditor"
      icon="pi pi-calendar"
      label="Sales"
      @click="emit('onAddSale')"
    />

    <SplitButton label="Links" icon="pi pi-external-link" :model="desktop" />
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
const emit = defineEmits(['onEditMaker', 'onAddSale'])

const { maker } = defineProps({
  maker: {
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

const links = []
if (maker.website) {
  links.push({
    label: 'Website',
    icon: 'pi pi-globe',
    url: maker.website,
    visible: !!maker.website,
    target: '_blank',
  })
}
if (maker.instagram) {
  links.push({
    label: 'Instagram',
    icon: 'pi pi-instagram',
    url: maker.instagram,
    visible: !!maker.instagram,
    target: '_blank',
  })
}
if (maker.discord) {
  links.push({
    label: 'Discord',
    icon: 'pi pi-discord',
    url: maker.discord,
    visible: !!maker.discord,
    target: '_blank',
  })
}
if (maker.artisancollector) {
  links.push({
    label: 'ArtisanCollector',
    icon: 'pi pi-globe',
    url: maker.artisancollector,
    visible: !!maker.artisancollector,
    target: '_blank',
  })
}

const catalogue = []
if (Array.isArray(maker.document_ids)) {
  if (maker.document_ids.length > 1) {
    maker.document_ids.forEach((docId, idx) => {
      catalogue.push({
        label: `Part ${idx + 1}`,
        icon: 'pi pi-file-word',
        url: `https://docs.google.com/document/d/${docId}`,
        target: '_blank',
      })
    })
  } else {
    catalogue.push({
      label: 'Catalogue',
      icon: 'pi pi-file-word',
      url: `https://docs.google.com/document/d/${maker.document_ids[0]}`,
      target: '_blank',
    })
  }
}

const desktop = [...links, { separator: true }, ...catalogue]

const mobile = computed(() => {
  return [
    {
      label: 'Maker Profile',
      visible: isEditor.value,
      items: [
        {
          label: 'Edit',
          icon: 'pi pi-pen-to-square',
          command: () => {
            emit('onEditMaker')
          },
        },
      ],
    },
    {
      separator: true,
      visible: isEditor.value,
    },
    {
      label: 'Social',
      items: links,
    },
    {
      separator: true,
    },
    {
      label: 'Catalogue',
      items: catalogue,
    },
  ]
})
</script>
