<template>
  <a-card class="marketplace-filter">
    <a-typography-title :level="5">
      <filter-outlined /> Filter
    </a-typography-title>

    <a-form layout="vertical">
      <a-form-item>
        <a-auto-complete
          v-model:value="searchText"
          allow-clear
          :options="dataSources"
          @select="onSelect"
          @search="handleSearch"
        >
          <template #option="item">
            <template v-if="item.options">
              <span>
                {{ item.title }}
              </span>
            </template>
            <template v-else>
              <div
                :style="{ display: 'flex', justifyContent: 'space-between' }"
              >
                {{ item.title }}
              </div>
            </template>
          </template>
          <a-input placeholder="Search" />
        </a-auto-complete>
      </a-form-item>

      <a-form-item label="Type">
        <a-radio-group
          v-model:value="marketplaceCfg.type"
          :options="tradeTypeOptions"
        />
      </a-form-item>

      <a-form-item label="Maker">
        <a-input v-model:value="marketplaceCfg.maker_name" disabled />
      </a-form-item>

      <a-form-item label="Sculpt">
        <a-input v-model:value="marketplaceCfg.sculpt_name" disabled />
      </a-form-item>

      <a-form-item label="Colorway">
        <a-input v-model:value="marketplaceCfg.colorway_name" disabled />
      </a-form-item>

      <a-form-item>
        <a-button block @click="onClearFilter">
          <clear-outlined /> Clear
        </a-button>
      </a-form-item>
    </a-form>
  </a-card>
</template>

<script setup>
const marketplaceCfg = useState('marketplace-config', () => ({
  type: 'any',
}))

const tradeTypeOptions = [
  { label: 'Any', value: 'any' },
  { label: 'Buying', value: 'buy' },
  { label: 'Selling', value: 'sell' },
]

const searchText = ref('')
const dataSources = ref([])

const handleSearch = async (query) => {
  const { data } = await useAsyncData(() =>
    $fetch('/api/search', { params: { query } }),
  )

  dataSources.value = data.value.data
}

const onSelect = async (path, option) => {
  searchText.value = ''
  dataSources.value = []

  const { title, value, ...rest } = option

  marketplaceCfg.value = {
    type: marketplaceCfg.value.type,
    ...rest,
  }
}

const onClearFilter = () => {
  marketplaceCfg.value = {
    type: 'any',
  }
}
</script>

<style>
.marketplace-filter {
  height: 100%;
}
</style>
