<template>
  <nuxt-link :to="`/artisan/maker/${maker.id}`">
    <a-card hoverable :title="maker.name" :head-style="artisanCardHeadStyle">
      <template v-if="authenticated" #extra>
        <pushpin-filled
          v-if="favorite"
          :style="{ color: 'deeppink' }"
          @click="
            (e) => {
              e.preventDefault()
              addFavoriteMaker(maker.id)
            }
          "
        />
        <pushpin-outlined
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
const { authenticated, favorites, user } = storeToRefs(userStore)

const addFavoriteMaker = (name) => {
  if (favorites.value.includes(name)) {
    favorites.value = favorites.value.filter((m) => m !== name)
  } else {
    favorites.value.push(name)
  }

  $fetch(`/api/users/${user.value.uid}`, {
    method: 'post',
    body: {
      favorite_makers: favorites.value,
    },
  })
}
</script>
