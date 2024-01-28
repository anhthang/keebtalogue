<template>
  <a-dropdown>
    <template #overlay>
      <a-menu>
        <a-menu-item v-if="isLinktree" key="linktree">
          <a :href="maker.website" target="_blank">
            <span class="anticon anticon-custom-icon">
              <icon name="LinktreeIcon" size="18" />
            </span>
            Linktree
          </a>
        </a-menu-item>
        <a-menu-item v-else-if="maker.website" key="website">
          <a :href="maker.website" target="_blank">
            <global-outlined /> Website
          </a>
        </a-menu-item>
        <a-menu-item v-if="maker.instagram" key="instagram">
          <a :href="maker.instagram" target="_blank">
            <instagram-outlined /> Instagram
          </a>
        </a-menu-item>
        <a-menu-item v-if="maker.discord" key="discord">
          <a :href="maker.discord" target="_blank">
            <span class="anticon anticon-custom-icon">
              <icon name="la:discord" />
            </span>
            Discord
          </a>
        </a-menu-item>
        <a-menu-item v-if="maker.artisancollector" key="artisancollector">
          <a :href="maker.artisancollector" target="_blank">
            <span class="anticon anticon-custom-icon">
              <icon name="ArtisanCollectorIcon" size="18" />
            </span>
            Artisan Collector
          </a>
        </a-menu-item>
        <a-menu-divider />
        <a-menu-item v-if="!isMultipleDocs">
          <a
            :href="`https://docs.google.com/document/d/${maker.document_ids[0]}`"
            target="_blank"
          >
            <FileWordOutlined /> Catalogue
          </a>
        </a-menu-item>
        <a-menu-item
          v-for="(docId, idx) in maker.document_ids"
          v-else
          :key="docId"
        >
          <a
            :href="`https://docs.google.com/document/d/${docId}`"
            target="_blank"
          >
            <FileWordOutlined /> Catalogue Part {{ idx + 1 }}
          </a>
        </a-menu-item>
      </a-menu>
    </template>
    <a-button>
      <LinkOutlined />
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

const isLinktree = maker.website && maker.website.includes('linktr.ee')
const isMultipleDocs = maker.document_ids.length > 1
</script>
