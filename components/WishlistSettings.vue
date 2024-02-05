<template>
  <a-card title="Settings" class="trading-settings">
    <template #extra>
      <a-radio-group v-model:value="tradingConfig.type" button-style="solid">
        <a-radio-button value="oneway"> Buy or Sell </a-radio-button>
        <a-radio-button value="twoway"> Trade </a-radio-button>
      </a-radio-group>
    </template>

    <a-form layout="vertical">
      <a-form-item :label="twowayTrading ? 'Want Title' : 'Title'">
        <a-input v-model:value="tradingConfig.want.title">
          <template #prefix><font-size-outlined /></template>
        </a-input>
      </a-form-item>
      <a-form-item :label="twowayTrading ? 'Want Collection' : 'Collection'">
        <a-select v-model:value="tradingConfig.want.collection">
          <a-select-option
            v-for="collection in collections"
            :key="collection.id"
            :value="collection.id"
          >
            {{ collection.name }}
          </a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item v-if="twowayTrading" label="Have Title">
        <a-input v-model:value="tradingConfig.have.title">
          <template #prefix><font-size-outlined /></template>
        </a-input>
      </a-form-item>
      <a-form-item v-if="twowayTrading" label="Have Collection">
        <a-select v-model:value="tradingConfig.have.collection">
          <a-select-option
            v-for="collection in collections"
            :key="collection.id"
            :value="collection.id"
          >
            {{ collection.name }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="Reddit">
        <a-input
          v-model:value="tradingConfig.social.reddit"
          placeholder="u/username"
        >
          <template #prefix><reddit-outlined /></template>
        </a-input>
      </a-form-item>
      <a-form-item label="Discord">
        <a-input
          v-model:value="tradingConfig.social.discord"
          placeholder="Discord#0000"
        >
          <template #prefix>
            <icon name="radix-icons:discord-logo" />
          </template>
        </a-input>
      </a-form-item>
      <a-form-item label="QQ">
        <a-input v-model:value="tradingConfig.social.qq" placeholder="00000000">
          <template #prefix><qq-outlined /></template>
        </a-input>
      </a-form-item>
    </a-form>
  </a-card>
</template>

<script setup>
const userStore = useUserStore()
const { collections, tradingConfig } = storeToRefs(userStore)

const twowayTrading = computed(() => {
  return tradingConfig.value.type === 'twoway'
})

watch(tradingConfig, () => {
  userStore.$patch({
    tradingConfig: tradingConfig.value,
  })
})
</script>

<style>
.trading-settings {
  height: 100%;
}
</style>
