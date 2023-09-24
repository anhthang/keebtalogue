<template>
  <nuxt-link :to="`/artisan/maker/${maker.id}`">
    <a-card hoverable :title="maker.name" :size="size">
      <template v-if="authenticated" #extra>
        <star-filled v-if="favorite" class="favorite" @click="(e) => {
            e.preventDefault();
            addFavoriteMaker(maker.id);
          }
          " />
        <star-outlined v-else @click="(e) => {
            e.preventDefault();
            addFavoriteMaker(maker.id);
          }
          " />
      </template>
      <template #cover>
        <img loading="lazy" :alt="maker.name" :src="`/logo/${$colorMode.value}/${maker.id}.png`" />
      </template>
    </a-card>
  </nuxt-link>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useUserStore } from "~~/stores/user";

const { $device } = useNuxtApp();
const { isMobile } = $device;
const size = isMobile ? "small" : "default";

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

<style>
.favorite {
  color: #eb2f96;
}
</style>
