<template>
  <nuxt-link :to="`/artisan/maker/${maker.id}`">
    <Card
      class="flex items-center flex-1 h-full"
      pt:header:class="flex items-center mx-5 h-44 md:h-60"
      pt:body:class="items-center"
    >
      <template #header>
        <NuxtImg
          :class="{
            invert: maker.invertible_logo && $colorMode.value === 'dark',
          }"
          loading="lazy"
          :alt="maker.name"
          :src="`/logo/${maker.id}.png`"
          width="100%"
        />
      </template>
      <template #title>{{ maker.name }}</template>
      <template v-if="authenticated" #footer>
        <Button
          v-if="favorite || Object.keys(favorites).length < 6"
          v-tooltip.bottom="{
            value: 'You can pin up to 6 makers.',
            disabled: favorite || Object.keys(favorites).length === 6,
          }"
          text
          size="small"
          severity="secondary"
          :label="favorite ? 'Unpin' : 'Pin'"
          :icon="favorite ? 'pi pi-bookmark-fill' : 'pi pi-bookmark'"
          @click="
            (e) => {
              e.preventDefault()
              addFavoriteMaker(maker.id)
            }
          "
        />
      </template>
    </Card>
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
  if (Object.hasOwn(favorites.value, name)) {
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete favorites.value[name]
  } else {
    favorites.value[name] = []
  }

  $fetch(`/api/users/${user.value.uid}`, {
    method: 'post',
    body: {
      favorite_makers: favorites.value,
    },
  })
}
</script>
