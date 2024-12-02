<template>
  <div v-if="$device.isDesktopOrTablet" class="flex gap-2">
    <Button
      v-if="isEditor"
      icon="pi pi-pen-to-square"
      label="Edit"
      severity="secondary"
      @click="emit('onEditMaker')"
    />

    <Button
      v-if="isEditor"
      icon="pi pi-calendar"
      label="Sales"
      severity="secondary"
      @click="emit('onAddSale')"
    />

    <Button
      v-if="Object.hasOwn(favorites, maker.id)"
      icon="pi pi-sliders-v"
      label="Customize Pins"
      severity="secondary"
      @click="emit('onCustomizePins')"
    />

    <SplitButton
      icon="pi pi-external-link"
      label="Links"
      severity="secondary"
      :model="desktop"
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
const emit = defineEmits(['onEditMaker', 'onAddSale', 'onCustomizePins'])

const { maker } = defineProps({
  maker: {
    type: Object,
    default: () => ({}),
  },
})

const userStore = useUserStore()
const { favorites, isEditor } = storeToRefs(userStore)

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

const documents = []
if (Array.isArray(maker.document_ids) && maker.document_ids.length) {
  if (maker.document_ids.length > 1) {
    maker.document_ids.forEach((docId, idx) => {
      documents.push({
        label: `Catalogue Part ${idx + 1}`,
        icon: 'pi pi-file-word',
        url: `https://docs.google.com/document/d/${docId}`,
        target: '_blank',
      })
    })
  } else {
    documents.push({
      label: 'Catalogue',
      icon: 'pi pi-file-word',
      url: `https://docs.google.com/document/d/${maker.document_ids[0]}`,
      target: '_blank',
    })
  }
}

const desktop = [
  ...links,
  {
    separator: true,
    visible: !!documents.length,
  },
  ...documents,
]

const mobile = computed(() => {
  return [
    {
      label: 'Editing',
      visible: isEditor.value,
      items: [
        {
          label: 'Edit',
          icon: 'pi pi-pen-to-square',
          command: () => {
            emit('onEditMaker')
          },
        },
        {
          label: 'Customize Pins',
          icon: 'pi pi-sliders-v',
          visible: Object.hasOwn(favorites.value, maker.id),
          command: () => {
            emit('onCustomizePins')
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
      visible: !!documents.length,
    },
    {
      label: 'Documents',
      visible: !!documents.length,
      items: documents,
    },
  ]
})
</script>
