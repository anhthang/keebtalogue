<template>
  <a-card title="Settings" class="trading-settings">
    <template #extra>
      <a-radio-group v-model:value="tradingConfig.type">
        <a-radio value="oneway"> Buy or Sell </a-radio>
        <a-radio value="twoway"> Trading </a-radio>
      </a-radio-group>
    </template>

    <a-form layout="vertical">
      <a-row :gutter="[16, 16]" type="flex">
        <a-col :xs="24" :md="12" :xl="6">
          <a-form-item :label="trading ? 'Want Title' : 'Title'">
            <a-input v-model:value="tradingConfig.want.title">
              <template #prefix><font-size-outlined /></template>
            </a-input>
          </a-form-item>
        </a-col>
        <a-col :xs="24" :md="12" :xl="6">
          <a-form-item :label="trading ? 'Want Collection' : 'Collection'">
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
        </a-col>
        <a-col :xs="24" :md="12" :xl="6">
          <a-form-item v-if="trading" label="Have Title">
            <a-input v-model:value="tradingConfig.have.title">
              <template #prefix><font-size-outlined /></template>
            </a-input>
          </a-form-item>
        </a-col>
        <a-col :xs="24" :md="12" :xl="6">
          <a-form-item v-if="trading" label="Have Collection">
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
        </a-col>
      </a-row>

      <a-row :gutter="[16, 16]" type="flex">
        <a-col :xs="24" :md="12" :xl="6">
          <a-form-item label="Reddit">
            <a-input
              v-model:value="tradingConfig.social.reddit"
              placeholder="u/username"
            >
              <template #prefix><reddit-outlined /></template>
            </a-input>
          </a-form-item>
        </a-col>
        <a-col :xs="24" :md="12" :xl="6">
          <a-form-item label="Discord">
            <a-input
              v-model:value="tradingConfig.social.discord"
              placeholder="Discord#0000"
            >
              <template #prefix><discord-outlined /></template>
            </a-input>
          </a-form-item>
        </a-col>
        <a-col :xs="24" :md="12" :xl="6">
          <a-form-item label="QQ">
            <a-input
              v-model:value="tradingConfig.social.qq"
              placeholder="00000000"
            >
              <template #prefix><qq-outlined /></template>
            </a-input>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-card>
</template>

<script setup>
const userStore = useUserStore()
const { collections, social } = storeToRefs(userStore)

const tradingConfig = useState('trading-config', () => {
  return {
    have: {
      collection: '',
      title: 'WTT',
    },
    want: {
      collection: '',
      title: 'WTB',
    },
    social,
    type: 'oneway',
  }
})

const trading = computed(() => tradingConfig.value.type === 'twoway')
</script>

<style>
.trading-settings {
  height: 100%;
}
</style>
