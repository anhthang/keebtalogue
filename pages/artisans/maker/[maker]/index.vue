<template>
  <div class="container artisan-container">
    <a-page-header
      :title="maker.name"
      :avatar="{
        props: {
          src: maker.img,
        },
      }"
    >
      <template #subTitle>
        <country-flag
          v-if="maker.nationality"
          :country="maker.nationality"
          size="small"
        />
      </template>

      <template #extra>
        <!-- <a-button
          v-if="user.isEditor"
          key="edit"
          type="primary"
          icon="edit"
          @click="showEditMakerModal"
        >
          Edit Maker
        </a-button> -->
        <a v-if="maker.website" :href="maker.website" target="_blank">
          <a-button key="3"><global-outlined /> Website </a-button>
        </a>
        <a v-if="maker.instagram" :href="maker.instagram" target="_blank">
          <a-button key="2"><instagram-outlined /> Instagram </a-button>
        </a>
        <a v-if="maker.discord" :href="maker.discord" target="_blank">
          <a-button key="1">
            <a-icon :component="DiscordSvg" class="custom-icon" />
            Discord
          </a-button>
        </a>
        <a :href="maker.src" target="_blank">
          <a-button v-if="maker.src" key="0">
            <file-word-outlined /> Catalog
          </a-button>
        </a>
      </template>

      <!-- <a-spin :spinning="loading"> -->
        <a-row :gutter="[8, 8]" type="flex">
          <a-col
            v-for="sculpt in sculpts"
            :key="sculpt.id"
            :xs="12"
            :sm="12"
            :md="8"
            :lg="6"
            :xl="4"
          >
            <nuxt-link :to="`/artisans/maker/${makerId}/${sculpt.slug}`">
              <a-card hoverable :title="sculpt.name" :size="size">
                <template #cover>
                  <img
                    loading="lazy"
                    :alt="sculpt.name"
                    :src="sculpt.preview"
                  />
                </template>
              </a-card>
            </nuxt-link>
          </a-col>
        </a-row>
      <!-- </a-spin> -->

      <!-- <a-modal
        v-model="showEditMaker"
        title="Edit Maker"
        destroy-on-close
        @ok="updateArtisanMaker"
      >
        <maker-form ref="artisanMaker" :is-edit="true" :metadata="maker" />
      </a-modal> -->
    </a-page-header>
  </div>
</template>

<script setup>
const maker = await fetch('https://raw.githubusercontent.com/keycap-archivist/database/master/db/trmk.json').then(res => res.json())

import { keyBy, sample, sortBy } from 'lodash'
import slugify from 'slugify'

const makerId = 'trmk'

let { sculpts } = maker

sculpts = sculpts.map((sculpt) => {
  const random = sample(sculpt.colorways)

  return {
    ...sculpt,
    slug: slugify(sculpt.name, { lower: true }),
    preview: random.img,
  }
})

sculpts = keyBy(sortBy(sculpts, 'name'), 'slug')
</script>
