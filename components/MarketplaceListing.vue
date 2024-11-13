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
          <img class="w-1/3" :src="`/svg/empty.svg`" alt="Empty" />

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
          <div class="flex justify-between">
            <Card v-if="authenticated" class="!shadow-none">
              <template #title>
                <i class="pi pi-discord mr-1 text-[#5865f2]" />
                {{ item.contact }}
              </template>
              <template #subtitle>
                <div class="flex items-center gap-2">
                  <Tag
                    v-if="item.type === 'buy'"
                    severity="info"
                    icon="pi pi-tags"
                    value="Buying"
                    pt:label:class="font-normal"
                  />
                  <Tag
                    v-else
                    severity="warn"
                    icon="pi pi-tags"
                    value="Selling"
                    pt:label:class="font-normal"
                  />

                  <Tag
                    severity="secondary"
                    icon="pi pi-clock"
                    :value="formatDateTime(item.created_at)"
                    pt:label:class="font-normal"
                  />
                </div>
              </template>
              <template #content>{{ item.message }}</template>
            </Card>
            <Button
              v-else
              text
              label="Login to Continue"
              icon="pi pi-eye-slash"
              @click="toggleShowLogin"
            />

            <AvatarGroup>
              <Avatar
                v-for="cap in item.items.slice(0, size)"
                :key="cap.id"
                v-tooltip.top="colorwayTitle(cap)"
                :image="cap.img"
                shape="circle"
                size="large"
              />
              <Avatar
                v-if="item.items.length > size"
                :label="`+${item.items.length - size}`"
                shape="circle"
                size="large"
              />
            </AvatarGroup>
          </div>
        </div>
      </template>
    </DataView>
  </Panel>

  <Dialog
    v-model:visible="visible"
    modal
    class="w-[36rem]"
    :closable="false"
    dismissable-mask
  >
    <ModalLogin />
  </Dialog>
</template>

<script setup>
const userStore = useUserStore()
const { authenticated } = storeToRefs(userStore)

const visible = ref(false)
const toggleShowLogin = () => {
  visible.value = !visible.value
}

const marketplaceCfg = useState('marketplace-config')

const size = 15

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
