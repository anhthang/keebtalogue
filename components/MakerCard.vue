<template>
  <nuxt-link :to="`/artisan/maker/${maker.id}`">
    <a-card hoverable :title="maker.name" :head-style="{ textAlign: 'center' }">
      <template v-if="authenticated" #extra>
        <star-filled
          v-if="favorite"
          :style="{ color: 'deeppink' }"
          @click="
            (e) => {
              e.preventDefault()
              addFavoriteMaker(maker.id)
            }
          "
        />
        <star-outlined
          v-else
          @click="
            (e) => {
              e.preventDefault()
              addFavoriteMaker(maker.id)
            }
          "
        />
      </template>
      <template #cover>
        <a-image
          :preview="false"
          :alt="maker.name"
          :src="`/logo/${$colorMode.value}/${maker.id}.png`"
          :fallback="`/logo/no_photo.png`"
        />
      </template>
    </a-card>
  </nuxt-link>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useUserStore } from '~~/stores/user'

const { maker, favorite } = defineProps({
  maker: {
    type: Object,
    default() {
      return {}
    },
  },
  favorite: Boolean,
})

const userStore = useUserStore()
const { authenticated } = storeToRefs(userStore)

const addFavoriteMaker = (id) => {
  userStore.updateFavoriteMakers(id)
}
</script>
