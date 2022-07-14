<template>
  <div class="container artisan-container">
    <a-page-header :title="sculpt.name">
      <template #extra>
        <a-button key="1" disabled type="primary">
          <file-add-outlined /> Submit new Colorway
        </a-button>
        <a-dropdown placement="bottomRight">
          <template #overlay>
            <a-menu @click="onChangeSortType">
              <a-menu-item key="name">
                <sort-ascending-outlined /> Sort by Name
              </a-menu-item>
              <a-menu-item key="date">
                <clock-circle-outlined /> Sort by Date
              </a-menu-item>
            </a-menu>
          </template>
          <a-button :icon="sortIcon"> Sort By </a-button>
        </a-dropdown>
      </template>

      <!-- <a-spin :spinning="loading"> -->
      <a-row :gutter="[8, 8]" type="flex">
        <a-col
          v-for="colorway in sculpt.colorways"
          :key="colorway.id"
          :xs="12"
          :sm="12"
          :md="8"
          :lg="6"
          :xl="4"
        >
          <a-card hoverable :title="colorway.name || '-'" :size="size">
            <template #extra>
              <bg-colors-outlined
                v-if="colorway.commissioned"
                class="commissioned"
              />
              <gift-outlined
                v-if="colorway.name.toLowerCase().includes('giveaway')"
                class="giveaway"
              />
            </template>
            <template #cover>
              <img loading="lazy" :alt="colorway.name" :src="colorway.img" />
            </template>

            <template #actions>
              <a-dropdown :trigger="['click']" placement="topCenter">
                <div><save-outlined /> Add to Collection</div>
                <template #overlay>
                  <a-menu>
                    <a-menu-item
                      v-for="collection in collections"
                      :key="collection.slug"
                      :disabled="!collections.length"
                      @click="addToCollection(collection, colorway)"
                    >
                      {{ collection.name }}
                    </a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </template>
            <a-card-meta v-if="colorway.releaseDate">
              <template #description>
                {{ colorway.releaseDate }}
              </template>
            </a-card-meta>
          </a-card>
        </a-col>
      </a-row>
      <!-- </a-spin> -->

      <conflict-sync-modal />
    </a-page-header>
  </div>
</template>

<script setup>
const { sculpts } = await fetch(
  "https://raw.githubusercontent.com/keycap-archivist/database/master/db/goldenstar-keycap.json"
).then((res) => res.json());
const sculpt = sculpts.find((s) => s.name === "Velites");

const size = "default";
</script>

<style lang="less">
.commissioned {
  color: palevioletred !important;
}
.giveaway {
  color: orange !important;
}
</style>