<template>
  <a-dropdown>
    <template #overlay>
      <a-menu>
        <a-menu-item v-if="maker.website" key="website">
          <template #icon><global-outlined /></template>
          <a :href="maker.website" target="_blank">Website</a>
        </a-menu-item>
        <a-menu-item v-if="maker.instagram" key="instagram">
          <template #icon><instagram-outlined /></template>
          <a :href="maker.instagram" target="_blank">Instagram</a>
        </a-menu-item>
        <a-menu-item v-if="maker.discord" key="discord">
          <template #icon><discord-outlined /></template>
          <a :href="maker.discord" target="_blank">Discord</a>
        </a-menu-item>
        <a-menu-item v-if="maker.artisancollector" key="artisancollector">
          <template #icon><artisan-collector-outlined /></template>
          <a :href="maker.artisancollector" target="_blank">
            Artisan Collector
          </a>
        </a-menu-item>
        <a-menu-divider />
        <a-menu-item v-if="!isMultipleDocs">
          <template #icon><file-word-outlined /></template>
          <a
            :href="`https://docs.google.com/document/d/${maker.document_ids[0]}`"
            target="_blank"
          >
            Catalogue
          </a>
        </a-menu-item>
        <a-menu-item
          v-for="(docId, idx) in maker.document_ids"
          v-else
          :key="docId"
        >
          <template #icon><file-word-outlined /></template>
          <a
            :href="`https://docs.google.com/document/d/${docId}`"
            target="_blank"
          >
            Catalogue Part {{ idx + 1 }}
          </a>
        </a-menu-item>
      </a-menu>
    </template>
    <a-button>
      <link-outlined />
      Links
    </a-button>
  </a-dropdown>
</template>

<script setup>
const { maker } = defineProps({
  maker: {
    type: Object,
    default() {
      return {}
    },
  },
})

const isMultipleDocs = maker.document_ids.length > 1
</script>
