<template>
  <Panel header="Settings" pt:header:class="text-xl">
    <template #icons>
      <SelectButton
        v-model="tradingConfig.type"
        :options="[
          { label: 'Buying', value: 'buy' },
          { label: 'Selling', value: 'sell' },
          { label: 'Trading', value: 'trade' },
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
              v-model.trim="tradingConfig.want.title"
              type="text"
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
            v-model="tradingConfig.want.collection"
            :options="
              collections.filter((c) =>
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
              v-model.trim="tradingConfig.have.title"
              type="text"
              fluid
            />
          </IconField>
        </div>
        <div v-if="trading" class="col-span-1 flex flex-col gap-2">
          <label for="trading_have_collection">Have Collection</label>
          <Select
            id="trading_have_collection"
            v-model="tradingConfig.have.collection"
            :options="collections.filter((c) => typeMap.sell.includes(c.type))"
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
  buy: ['personal', 'personal_buy', 'shareable', 'buy'],
  sell: ['personal', 'personal_sell', 'shareable', 'sell'],
  trade: ['personal', 'personal_buy', 'shareable', 'buy'],
}

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
    type: 'personal',
    fnf_only: false,
  }
})

tradingConfig.value.social = social.value

const trading = computed(() => tradingConfig.value.type === 'trade')
</script>
