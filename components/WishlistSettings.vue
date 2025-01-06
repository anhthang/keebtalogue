<template>
  <Panel header="Settings" pt:header:class="text-xl">
    <template #icons>
      <SelectButton
        v-model="tradingConfig.type"
        :options="[
          { label: 'Buying', value: 'buying' },
          { label: 'Selling', value: 'selling' },
          { label: 'Trading', value: 'trading' },
        ]"
        option-label="label"
        option-value="value"
      />
    </template>
    <div class="flex flex-col gap-4">
      <div class="grid grid-cols-4 gap-2">
        <div class="col-span-1 flex flex-col gap-2">
          <label for="trading_title">
            {{ trading ? 'Want Title' : 'Title' }}
          </label>
          <IconField>
            <InputIcon class="pi pi-pencil" />
            <InputText
              id="trading_title"
              v-model.trim="tradingConfig.buying.title"
              type="text"
              :placeholder="
                tradingConfig.type === 'selling'
                  ? tradingConfig.selling.placeholder
                  : tradingConfig.buying.placeholder
              "
              fluid
            />
          </IconField>
        </div>
        <div class="col-span-1 flex flex-col gap-2">
          <label for="trading_collection">
            {{ trading ? 'Want Collection' : 'Collection' }}
          </label>
          <Select
            id="trading_collection"
            v-model="tradingConfig.buying.collection"
            :options="
              collections.filter(
                (c) =>
                  c.category === 'artisan' &&
                  typeMap[tradingConfig.type].includes(c.type),
              )
            "
            option-label="name"
            option-value="id"
          />
        </div>
        <div v-if="trading" class="col-span-1 flex flex-col gap-2">
          <label for="trading_have">Have Title</label>
          <IconField>
            <InputIcon class="pi pi-pencil" />
            <InputText
              id="trading_have"
              v-model.trim="tradingConfig.selling.title"
              type="text"
              :placeholder="tradingConfig.selling.placeholder"
              fluid
            />
          </IconField>
        </div>
        <div v-if="trading" class="col-span-1 flex flex-col gap-2">
          <label for="trading_have_collection">Have Collection</label>
          <Select
            id="trading_have_collection"
            v-model="tradingConfig.selling.collection"
            :options="
              collections.filter(
                (c) =>
                  c.category === 'artisan' && typeMap.selling.includes(c.type),
              )
            "
            option-label="name"
            option-value="id"
          />
        </div>
      </div>
      <div class="grid grid-cols-4 gap-2">
        <div class="col-span-1 flex flex-col gap-2">
          <label for="trading_discord">Discord</label>
          <IconField>
            <InputIcon class="pi pi-discord" />
            <InputText
              id="trading_discord"
              v-model.trim="tradingConfig.social.discord"
              type="text"
              placeholder="username#1234"
              fluid
            />
          </IconField>
        </div>
        <div class="col-span-1 flex flex-col gap-2">
          <label for="trading_reddit">Reddit</label>
          <IconField>
            <InputIcon class="pi pi-reddit" />
            <InputText
              id="trading_reddit"
              v-model.trim="tradingConfig.social.reddit"
              type="text"
              placeholder="u/username"
              fluid
            />
          </IconField>
        </div>
        <div class="col-span-1 flex flex-col gap-2">
          <label for="trading_qq">QQ</label>
          <IconField>
            <InputIcon class="pi pi-comment" />
            <InputText
              id="trading_qq"
              v-model.trim="tradingConfig.social.qq"
              v-keyfilter.num
              type="text"
              placeholder="00000000"
              fluid
            />
          </IconField>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <Checkbox v-model="tradingConfig.fnf_only" input-id="fnf_only" binary />
        <label for="fnf_only">I do not accept PayPal G&S</label>
      </div>
    </div>
  </Panel>
</template>

<script setup>
const userStore = useUserStore()
const { collections, social } = storeToRefs(userStore)

const typeMap = {
  buying: ['personal', 'personal_buy', 'shareable', 'to_buy'],
  selling: ['personal', 'personal_sell', 'shareable', 'for_sale'],
  trading: ['personal', 'personal_buy', 'shareable', 'to_buy'],
}

const tradingConfig = useState('trading-config', () => {
  return {
    selling: {
      collection: '',
      title: '',
      placeholder: 'For sale',
    },
    buying: {
      collection: '',
      title: '',
      placeholder: 'Looking for',
    },
    social,
    type: 'buying',
    fnf_only: false,
  }
})

tradingConfig.value.social = social.value

const trading = computed(() => tradingConfig.value.type === 'trading')
watch(trading, () => {
  if (trading.value) {
    tradingConfig.value.selling.placeholder = 'For sale or trade'
  }
})
</script>
