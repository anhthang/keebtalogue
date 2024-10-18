<template>
  <SplitButton label="Links" icon="pi pi-link" :model="links" />
</template>

<script setup>
const { maker } = defineProps({
  maker: {
    type: Object,
    default: () => ({}),
  },
})

const links = []
if (maker.website) {
  links.push({
    label: 'Website',
    icon: 'pi pi-globe',
    command: () => {
      window.open(maker.website, '_blank')
    },
  })
}
if (maker.instagram) {
  links.push({
    label: 'Instagram',
    icon: 'pi pi-instagram',
    command: () => {
      window.open(maker.instagram, '_blank')
    },
  })
}
if (maker.discord) {
  links.push({
    label: 'Discord',
    icon: 'pi pi-discord',
    command: () => {
      window.open(maker.discord, '_blank')
    },
  })
}
if (maker.artisancollector) {
  links.push({
    label: 'ArtisanCollector',
    icon: 'pi pi-globe',
    command: () => {
      window.open(maker.artisancollector, '_blank')
    },
  })
}

if (Array.isArray(maker.document_ids)) {
  links.push({
    separator: true,
  })
  if (maker.document_ids.length > 1) {
    maker.document_ids.forEach((docId, idx) => {
      links.push({
        label: `Catalogue Part ${idx + 1}`,
        icon: 'pi pi-file-word',
        command: () => {
          window.open(`https://docs.google.com/document/d/${docId}`, '_blank')
        },
      })
    })
  } else {
    links.push({
      label: 'Catalogue',
      icon: 'pi pi-file-word',
      command: () => {
        window.open(
          `https://docs.google.com/document/d/${maker.document_ids[0]}`,
          '_blank',
        )
      },
    })
  }
}
</script>
