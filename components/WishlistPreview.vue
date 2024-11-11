<template>
  <Panel
    v-if="wantItems.length || haveItems.length"
    :header="copying ? 'Contact' : 'Preview'"
    pt:root:class="trading-preview"
    pt:header:class="text-xl"
  >
    <template v-if="!copying" #icons>
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
    <template v-else #icons>
      <Button
        size="large"
        icon="pi pi-send"
        severity="success"
        text
        :label="`From ${$config.public.appName} with love`"
      />
    </template>

    <div class="flex flex-col gap-6">
      <div
        class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6 gap-4"
      >
        <Message
          v-if="tradingConfig.social.discord"
          size="large"
          icon="pi pi-discord"
          severity="info"
          variant="simple"
        >
          {{ tradingConfig.social.discord }}
        </Message>
        <Message
          v-if="tradingConfig.social.reddit"
          size="large"
          icon="pi pi-reddit"
          severity="error"
          variant="simple"
        >
          {{ tradingConfig.social.reddit }}
        </Message>
        <Message
          v-if="tradingConfig.social.qq"
          size="large"
          icon="pi pi-comment"
          severity="warn"
          variant="simple"
        >
          {{ tradingConfig.social.qq }}
        </Message>
      </div>

      <Message
        v-if="wantItems.length + haveItems.length >= 24 && !copying"
        variant="simple"
        icon="pi pi-info-circle"
      >
        For optimal image display, it's <strong>recommended</strong> to keep
        your wishlist between 16-24 items.
      </Message>

      <Message
        v-if="tradingConfig.fnf_only"
        severity="warn"
        icon="pi pi-exclamation-triangle"
        variant="simple"
      >
        Please note that the seller does not accept PayPal Goods & Services
        (G&S). This means that if you choose to proceed with the transaction,
        you will not have PayPal's buyer protection in place.
      </Message>

      <Message v-if="errorText" class="w-fit mx-auto" severity="error">
        {{ errorText }}
      </Message>

      <Divider
        v-if="wantItems.length"
        align="center"
        class="text-4xl font-bold"
      >
        {{ tradingConfig.want.title }}
      </Divider>

      <DraggableCard :data="wantItems" :copying="copying" />

      <Divider
        v-if="haveItems.length && trading"
        align="center"
        class="text-4xl font-bold"
      >
        {{ tradingConfig.have.title }}
      </Divider>

      <DraggableCard v-if="trading" :data="haveItems" :copying="copying" />
    </div>

    <Toast />
  </Panel>
</template>

<script setup>
import groupBy from 'lodash.groupby'

const toast = useToast()

const userStore = useUserStore()
const { authenticated, user } = storeToRefs(userStore)

const tradingConfig = useState('trading-config')
const trading = computed(() => tradingConfig.value.type === 'twoway')

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

const wantItems = computed(
  () => collections.value[tradingConfig.value.want.collection] || [],
)
const haveItems = computed(
  () => collections.value[tradingConfig.value.have.collection] || [],
)

watch(authenticated, () => refresh())

const errorText = ref()
const copying = ref(false)

const screenshot = async (download = false) => {
  copying.value = true

  const card = document.getElementsByClassName('trading-preview')[0]

  try {
    if (download) {
      await downloadScreenshot(card)
    } else {
      await copyScreenshot(card, toast, !isDesktop)
    }
  } catch (error) {
    errorText.value = error.message
  }

  copying.value = false
}

const tradingText = computed(() => {
  let text =
    `**${tradingConfig.value.want.title}**\n` +
    `${wantItems.value.map((c) => `- ${colorwayTitle(c)}`).join('\n')}`

  if (trading.value) {
    text +=
      `\n\n` +
      `**${tradingConfig.value.have.title}**\n` +
      `${haveItems.value.map((c) => `- ${colorwayTitle(c)}`).join('\n')}`
  }

  return text
})

const copyToClipboard = () => {
  navigator.clipboard.writeText(tradingText.value)
  toast.add({
    severity: 'success',
    summary: 'Copied to clipboard!',
    life: 3000,
  })
}
</script>
