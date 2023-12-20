<template>
  <div class="container artisan-container">
    <a-spin :spinning="pending">
      <a-page-header :title="data.name">
        <template #breadcrumb>
          <a-breadcrumb>
            <a-breadcrumb-item>
              <nuxt-link>Keycaps</nuxt-link>
            </a-breadcrumb-item>
            <a-breadcrumb-item>
              <nuxt-link :to="`/keycap/${data.profile_id}`">
                {{ data.profile_id.toUpperCase() }}
              </nuxt-link>
            </a-breadcrumb-item>
            <a-breadcrumb-item>{{ data.name }}</a-breadcrumb-item>
          </a-breadcrumb>
        </template>

        <a-row :gutter="[8, 8]" type="flex">
          <a-col>
            <a-descriptions>
              <a-descriptions-item v-if="data.designer" label="Designer">
                {{ data.designer }}
              </a-descriptions-item>
              <a-descriptions-item v-if="data.profile" label="Profile">
                {{ data.profile }}
              </a-descriptions-item>
              <a-descriptions-item v-if="data.url" label="Website">
                <a :href="data.url" target="_blank">Link</a>
              </a-descriptions-item>
            </a-descriptions>
          </a-col>
        </a-row>

        <a-row :gutter="[8, 8]" type="flex">
          <a-col
            v-for="kit in data.kits"
            :key="kit.id"
            :xs="12"
            :sm="12"
            :md="8"
            :xl="6"
          >
            <a-card
              hoverable
              :title="kit.name"
              :head-style="artisanCardHeadStyle"
            >
              <template #cover>
                <a-image loading="lazy" :alt="kit.name" :src="kit.img" />
                <!-- <img loading="lazy" :alt="kit.name" :src="kit.img" /> -->
              </template>
              <template #actions>
                <span><dollar-outlined key="edit" /> {{ kit.price }} </span>
                <span><number-outlined key="setting" /> {{ kit.qty }} </span>
              </template>
            </a-card>
          </a-col>
        </a-row>

        <a-tabs v-if="false">
          <a-tab-pane
            v-for="(colorways, maker) in data.artisans"
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
                <a-card hoverable :title="colorwayTitle(colorway)">
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
import groupBy from 'lodash.groupby'

const route = useRoute()

const { profile, keycap } = route.params

const { data, pending } = await useAsyncData(() =>
  $fetch(`/api/keycaps/${profile}/${keycap}`).then((data) => {
    data.artisans = groupBy(data.artisans, 'maker_name')
    return data
  }),
)
</script>
