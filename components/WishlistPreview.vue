<template>
  <Panel
    v-if="buyingItems.length || sellingItems.length"
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
        v-if="buyingItems.length + sellingItems.length >= 24 && !copying"
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
        v-if="buyingItems.length"
        align="center"
        class="text-4xl font-bold"
      >
        {{ tradingConfig.buying.title }}
      </Divider>

      <DraggableCard :data="buyingItems" :copying="copying" :buying="true" />

      <Divider
        v-if="sellingItems.length && trading"
        align="center"
        class="text-4xl font-bold"
      >
        {{ tradingConfig.selling.title }}
      </Divider>

      <DraggableCard
        v-if="trading"
        :data="sellingItems"
        :copying="copying"
        :selling="true"
      />

      <Message variant="simple" severity="success">
        <template #icon>
          <NuxtImg
            class="h-8"
            :alt="$config.public.appName"
            :src="
              $colorMode.value === 'dark'
                ? '/logo-outlined.png'
                : '/logo-filled.png'
            "
          />
        </template>
        From {{ $config.public.appName }} with love
      </Message>
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
const trading = computed(() => tradingConfig.value.type === 'trade')

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
    const buying = JSON.parse(
      localStorage.getItem('Keebtalogue_Buying') || '[]',
    )
    const selling = JSON.parse(
      localStorage.getItem('Keebtalogue_Selling') || '[]',
    )

    collections.value = {
      buying: Object.values(buying),
      selling: Object.values(selling),
    }
  }
})

const buyingItems = computed(
  () => collections.value[tradingConfig.value.buying.collection] || [],
)
const sellingItems = computed(
  () => collections.value[tradingConfig.value.selling.collection] || [],
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
    `**${tradingConfig.value.buying.title}**\n` +
    `${buyingItems.value.map((c) => `- ${colorwayTitle(c)}`).join('\n')}`

  if (trading.value) {
    text +=
      `\n\n` +
      `**${tradingConfig.value.selling.title}**\n` +
      `${sellingItems.value.map((c) => `- ${colorwayTitle(c)}`).join('\n')}`
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
