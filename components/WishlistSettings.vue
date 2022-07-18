<template>
  <a-card title="Settings" size="small" class="wishlist-settings">
    <template #extra>
      <a-radio-group v-model:value="wishlishConfig.want_to" button-style="solid">
        <a-radio-button value="buy"> Buy </a-radio-button>
        <a-radio-button value="sell"> Sell </a-radio-button>
        <a-radio-button value="trade"> Trade </a-radio-button>
      </a-radio-group>
    </template>

    <a-form layout="vertical">
      <a-form-item :label="wantToTrade ? 'Want Title' : 'Title'">
        <a-input v-model:value="wishlishConfig.wish.title">
          <font-size-outlined />
        </a-input>
      </a-form-item>
      <a-form-item :label="wantToTrade ? 'Want Collection' : 'Collection'">
        <a-select v-model:value="wishlishConfig.wish.collection">
          <a-select-option
            v-for="collection in collections"
            :key="collection.slug"
            :value="collection.slug"
          >
            {{ collection.name }}
          </a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item v-if="wantToTrade" label="Have Title">
        <a-input v-model:value="wishlishConfig.trade.title">
          <font-size-outlined />
        </a-input>
      </a-form-item>
      <a-form-item v-if="wantToTrade" label="Have Collection">
        <a-select v-model:value="wishlishConfig.trade.collection">
          <a-select-option
            v-for="collection in collections"
            :key="collection.slug"
            :value="collection.slug"
          >
            {{ collection.name }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="Reddit">
        <a-input
          v-model:value="wishlishConfig.social.reddit"
          placeholder="u/username"
        >
          <reddit-outlined />
        </a-input>
      </a-form-item>
      <a-form-item label="Discord">
        <a-input
          v-model:value="wishlishConfig.social.discord"
          placeholder="Discord#0000"
        >
          <aliwangwang-outlined />
        </a-input>
      </a-form-item>
      <a-form-item label="QQ">
        <a-input v-model:value="wishlishConfig.social.qq" placeholder="00000000">
          <qq-outlined />
        </a-input>
      </a-form-item>
    </a-form>
  </a-card>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useUserStore } from "~~/stores/user";

const userStore = useUserStore();
const { collections, social, wishlishConfig } = storeToRefs(userStore);

const wantToTrade = computed(() => {
  return wishlishConfig.value.want_to === "trade";
});

watch(wishlishConfig.value, () => {
  userStore.$patch({
    wishlishConfig: wishlishConfig.value
  })
})
</script>

<style lang="less">
.wishlist-settings {
  .ant-select {
    width: 100%;
  }
}
</style>
