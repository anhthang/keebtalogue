<template>
  <nuxt-link :to="`/artisan/maker/${maker.id}`">
    <a-card hoverable :title="maker.name" :size="size">
      <template v-if="authenticated" #extra>
        <star-filled
          v-if="favorite"
          class="favorite-maker"
          @click="
            (e) => {
              e.preventDefault();
              addFavoriteMaker(maker.id);
            }
          "
        />
        <star-outlined
          v-else
          @click="
            (e) => {
              e.preventDefault();
              addFavoriteMaker(maker.id);
            }
          "
        />
      </template>
      <template #cover>
        <img loading="lazy" :alt="maker.name" :src="maker.img || nologo" />
      </template>
    </a-card>
  </nuxt-link>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useUserStore } from "~~/stores/user";

const size = "default";
const nologo = "https://i.imgur.com/wYMcZiI.png";

const { maker, favorite } = defineProps({
  maker: Object,
  favorite: Boolean,
});

const userStore = useUserStore();
const { authenticated } = storeToRefs(userStore);

const addFavoriteMaker = (id) => {
  userStore.updateFavoriteMakers(id);
};
</script>
