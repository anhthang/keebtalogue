<template>
  <nuxt-link :to="`/artisan/maker/${maker.id}`">
    <a-badge>
      <template v-if="authenticated" #count>
        <pushpin-filled
          v-if="favorite"
          :style="{ color: 'deeppink', fontSize: '16px' }"
          @click="
            (e) => {
              e.preventDefault()
              addFavoriteMaker(maker.id)
            }
          "
        />
        <pushpin-outlined
          v-else
          :style="{ fontSize: '16px' }"
          @click="
            (e) => {
              e.preventDefault()
              addFavoriteMaker(maker.id)
            }
          "
        />
      </template>

      <a-card hoverable>
        <template #cover>
          <a-image
            :class="
              maker.invertible_logo && $colorMode.value === 'dark'
                ? 'invertible-logo'
                : ''
            "
            :preview="false"
            :alt="maker.name"
            :src="`/logo/${maker.id}.png`"
            :fallback="`/logo/no_photo.png`"
          />
        </template>

        <a-card-meta :title="maker.name" />
      </a-card>
    </a-badge>
  </nuxt-link>
</template>

<script setup>
const { maker, favorite } = defineProps({
  maker: {
    type: Object,
    default: () => ({}),
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

<style>
.maker-container .ant-badge {
  width: 100%;
  height: 100%;
}
</style>
