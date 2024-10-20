<template>
  <Panel header="Preview" pt:header:class="text-xl">
    <template #icons>
      <div class="flex gap-2">
        <Button
          size="small"
          severity="secondary"
          label="Copy Text"
          icon="pi pi-clipboard"
          @click="copyToClipboard"
        />
        <Button
          size="small"
          severity="secondary"
          label="Copy Image"
          icon="pi pi-images"
          @click="screenshot(false)"
        />
        <Button
          size="small"
          severity="secondary"
          label="Download"
          icon="pi pi-download"
          @click="screenshot(true)"
        />
      </div>
    </template>

    <div class="trading-image flex flex-col gap-6">
      <div
        class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4"
      >
        <span class="col-span-1">
          Reddit: {{ tradingConfig.social.reddit }}
        </span>
        <span class="col-span-1">
          Discord: {{ tradingConfig.social.discord }}
        </span>
        <span class="col-span-1">QQ: {{ tradingConfig.social.qq }}</span>
      </div>

      <span v-if="tradingConfig.fnf_only" class="text-yellow-600">
        <strong>
          Please note that the seller does not accept PayPal Goods & Services
          (G&S). This means that if you choose to proceed with the transaction,
          you will not have PayPal's buyer protection in place.
        </strong>
      </span>

      <!-- <span class="text-2xl font-bold">{{ tradingConfig.want.title }}</span> -->
      <Divider align="center" class="text-3xl font-bold">
        {{ tradingConfig.want.title }}
      </Divider>
      <draggable
        :list="draggableWantList"
        item-key="id"
        group="group"
        class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4"
      >
        <template #item="{ element }">
          <Card
            :key="element.element_id"
            class="flex items-center flex-1 overflow-hidden"
            pt:header:class="h-[250px]"
            pt:body:class="items-center"
            pt:caption:class="items-center"
          >
            <template #header>
              <img
                :alt="element.name"
                :src="element.img"
                class="h-full object-cover"
              />
            </template>
            <template #title>{{ element.name || '-' }}</template>
            <template #subtitle>{{ element.sculpt_name }}</template>

            <template #footer>
              <Button
                text
                size="small"
                severity="danger"
                label="Remove"
                icon="pi pi-trash"
                @click="removeCap(element, 'want')"
              />
            </template>
          </Card>
        </template>
      </draggable>

      <Divider
        v-if="draggableHaveList.length && trading"
        align="center"
        class="text-3xl font-bold"
      >
        {{ tradingConfig.have.title }}
      </Divider>
      <draggable
        v-if="draggableHaveList.length && trading"
        :list="draggableHaveList"
        item-key="id"
        group="group"
        class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4"
      >
        <template #item="{ element }">
          <Card
            :key="element.element_id"
            class="flex items-center flex-1 overflow-hidden"
            pt:header:class="h-[250px]"
            pt:body:class="items-center"
            pt:caption:class="items-center"
          >
            <template #header>
              <img
                :alt="element.name"
                :src="element.img"
                class="h-full object-cover"
              />
            </template>
            <template #title>{{ element.name || '-' }}</template>
            <template #subtitle>{{ element.sculpt_name }}</template>

            <template #footer>
              <Button
                text
                size="small"
                severity="danger"
                label="Remove"
                icon="pi pi-trash"
                @click="removeCap(element, 'have')"
              />
            </template>
          </Card>
        </template>
      </draggable>
    </div>
  </Panel>
</template>

<script setup>
import copy from 'ant-design-vue/lib/_util/copy-to-clipboard'
import groupBy from 'lodash.groupby'
import draggable from 'vuedraggable'

const userStore = useUserStore()
const { authenticated, user } = storeToRefs(userStore)

const tradingConfig = useState('trading-config')

const trading = computed(() => tradingConfig.value.type === 'twoway')

const draggableWantList = ref([])
const draggableHaveList = ref([])

const { isDesktop } = useDevice()

const { data: collections, refresh } = await useAsyncData(() => {
  if (authenticated.value) {
    return $fetch(`/api/users/${user.value.uid}/collection-items`).then(
      (data) => groupBy(data, 'collection_id'),
    )
  } else {
    return []
  }
})

onMounted(() => {
  if (!authenticated.value) {
    const want = JSON.parse(localStorage.getItem('Keebtalogue_want') || '[]')
    const have = JSON.parse(localStorage.getItem('Keebtalogue_have') || '[]')

    collections.value = {
      want: Object.values(want),
      have: Object.values(have),
    }
  }
})

watch(
  tradingConfig,
  () => {
    draggableWantList.value =
      collections.value[tradingConfig.value.want.collection] || []
    if (tradingConfig.value.have.collection) {
      draggableHaveList.value =
        collections.value[tradingConfig.value.have.collection] || []
    }
  },
  { deep: true },
)

watch(authenticated, () => refresh())

const errorText = ref()

const screenshot = async (download = false) => {
  const card = document.getElementsByClassName('trading-preview')[0]

  // hide some items for rendering
  const cardHead = card.getElementsByClassName('ant-card-head')[0]
  const bodyActions = card
    .getElementsByClassName('ant-card-body')[0]
    .getElementsByClassName('ant-card-actions')

  cardHead.classList.add('trading-card-hide')
  bodyActions.forEach((ex) => {
    ex.classList.add('trading-card-hide')
  })

  try {
    if (download) {
      await downloadScreenshot(card)
    } else {
      await copyScreenshot(card, !isDesktop)
    }
  } catch (error) {
    errorText.value = error.message
  }

  // revert
  cardHead.classList.remove('trading-card-hide')
  bodyActions.forEach((ex) => {
    ex.classList.remove('trading-card-hide')
  })
}

const tradingText = computed(() => {
  let text =
    `**${tradingConfig.value.want.title}**\n` +
    `${draggableWantList.value.map((c) => `- ${colorwayTitle(c)}`).join('\n')}`

  if (trading.value) {
    text +=
      `\n\n` +
      `**${tradingConfig.value.have.title}**\n` +
      `${draggableHaveList.value
        .map((c) => `- ${colorwayTitle(c)}`)
        .join('\n')}`
  }

  return text
})

const removeCap = (colorway, type) => {
  Modal.confirm({
    title: 'Remove Artisan',
    content: 'Are you sure you want to continue?',
    onOk() {
      if (type === 'want') {
        draggableWantList.value = draggableWantList.value.filter(
          (c) => c.id !== colorway.id,
        )
      } else {
        draggableHaveList.value = draggableHaveList.value.filter(
          (c) => c.id !== colorway.id,
        )
      }
    },
  })
}

const copyToClipboard = () => {
  copy(tradingText.value)
  message.success('Copied to clipboard!')
}
</script>

<style>
.trading-preview {
  height: 100%;

  .ant-divider-inner-text {
    font-size: 3rem;
  }

  .trading-card-hide {
    display: none;
  }
}

.draggable-row {
  display: flex;
  flex-flow: row wrap;
  margin-left: -0.25rem;
  margin-right: -0.25rem;
  row-gap: 0.5rem;
}
</style>
