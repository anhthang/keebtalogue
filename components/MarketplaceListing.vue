<template>
  <Panel
    header="Public Trades"
    pt:root:class="h-full"
    pt:header:class="text-xl"
  >
    <DataView
      :value="trades"
      paginator
      :rows="5"
      :total-records="trades.length"
      :always-show-paginator="false"
    >
      <template #empty>
        <div class="flex flex-col items-center gap-8">
          <img class="w-2/4" :src="`/svg/empty.svg`" alt="Empty" />

          <div class="text-2xl">
            We couldn't find any items that meet your search criteria.
          </div>
        </div>
      </template>
      <template #list="slotProps">
        <div
          v-for="(item, index) in slotProps.items"
          :key="index"
          class="flex flex-col p-4"
          :class="{
            'border-t border-zinc-100 dark:border-zinc-700': index !== 0,
          }"
        >
          <div class="flex flex-col gap-2">
            {{ item.message }}
            <div class="flex items-center gap-2">
              <Tag
                v-if="item.type === 'buy'"
                severity="info"
                icon="pi pi-shopping-bag"
                value="Buying"
                pt:label:class="font-normal"
              />
              <Tag
                v-else
                severity="warn"
                icon="pi pi-shop"
                value="Selling"
                pt:label:class="font-normal"
              />

              <Tag
                v-if="item.contact"
                severity="secondary"
                icon="pi pi-user"
                :value="item.contact"
                pt:label:class="font-normal"
              />

              <Tag
                severity="secondary"
                icon="pi pi-clock"
                :value="formatDateTime(item.created_at)"
                pt:label:class="font-normal"
              />
            </div>
            <AvatarGroup>
              <Avatar
                v-for="cap in item.items"
                :key="cap.id"
                :image="cap.img"
                size="large"
              />
            </AvatarGroup>
          </div>
        </div>
      </template>
    </DataView>
  </Panel>
</template>

<script setup>
const marketplaceCfg = useState('marketplace-config')

const { data, refresh } = await useAsyncData(() =>
  $fetch('/api/marketplace', {
    query: {
      maker_id: marketplaceCfg.value.maker_id,
      sculpt_name: marketplaceCfg.value.sculpt_name,
      colorway_id: marketplaceCfg.value.colorway_id,
    },
  }),
)

watch(marketplaceCfg, () => {
  refresh()
})

const trades = computed(() => {
  const { type } = marketplaceCfg.value
  return type === 'any' ? data.value : data.value.filter((i) => i.type === type)
})
</script>
