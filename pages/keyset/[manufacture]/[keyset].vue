<template>
  <div class="container maker-container">
    <a-spin :spinning="pending">
      <a-page-header title="Keyset">
        <a-tabs>
          <a-tab-pane
            v-for="(colorways, maker) in data"
            :key="maker"
            :tab="maker"
          >
            <a-row :gutter="[8, 8]" type="flex">
              <a-col
                v-for="colorway in colorways"
                :key="colorway.id"
                :xs="24"
                :sm="24"
                :md="8"
                :lg="6"
                :xl="4"
              >
                <a-card
                  hoverable
                  :title="cardTitle(colorway)"
                  :size="size"
                  class="sculpt-card"
                >
                  <template #extra>
                    <bg-colors-outlined
                      v-if="colorway.commissioned"
                      class="commissioned"
                    />
                    <gift-filled v-if="colorway.giveaway" class="giveaway" />
                  </template>
                  <template #cover>
                    <img
                      loading="lazy"
                      :alt="colorway.name"
                      :src="colorway.img"
                      @click="showColorwayInformationModal(colorway)"
                    />
                  </template>

                  <!-- <template v-if="collections.length" #actions>
                    <a-dropdown :trigger="['click']" placement="top">
                      <div><save-outlined /> Add to Collection</div>
                      <template #overlay>
                        <a-menu>
                          <a-menu-item
                            v-for="collection in collections"
                            :key="collection.id"
                            :disabled="!collections.length"
                            @click="addToCollection(collection, colorway)"
                          >
                            {{ collection.name }}
                          </a-menu-item>
                        </a-menu>
                      </template>
                    </a-dropdown>
                  </template> -->
                </a-card>
              </a-col>
            </a-row>
          </a-tab-pane>
        </a-tabs>
      </a-page-header>
    </a-spin>
  </div>
</template>

<script setup>
const { $device } = useNuxtApp();
const { isMobile } = $device;
const size = isMobile ? "small" : "default";

const route = useRoute();

const { manufacture, keyset } = route.params;

const { data, pending } = await useAsyncData(() =>
  $fetch(`/api/keysets/${manufacture}/${keyset}`)
);

const cardTitle = (clw) => `${clw.name} ${clw.sculpt_id}`;
</script>
