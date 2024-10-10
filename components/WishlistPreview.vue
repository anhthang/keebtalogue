<template>
  <a-card title="Preview" class="trading-preview">
    <template #extra>
      <a-flex gap="small">
        <a-tooltip title="Copy text to clipboard">
          <a-button @click="copyToClipboard"> <copy-outlined /> </a-button>
        </a-tooltip>

        <a-tooltip title="Copy screenshot to clipboard">
          <a-button @click="screenshot(false)">
            <picture-outlined />
          </a-button>
        </a-tooltip>

        <a-tooltip title="Download screenshot">
          <a-button v-if="isDesktop" @click="screenshot(true)">
            <download-outlined />
          </a-button>
        </a-tooltip>
      </a-flex>
    </template>

    <a-result
      v-if="!Object.keys(collections).length"
      status="404"
      title="¯\_(ツ)_/¯"
      sub-title="You don’t have any collections yet. Create a collection to get started."
    >
      <template #extra>
        <nuxt-link to="/artisan/collection">
          <a-button type="primary"> Manage Collection </a-button>
        </nuxt-link>
      </template>
    </a-result>
    <a-watermark
      v-else
      :height="50"
      :width="248"
      :image="`/watermark-${$colorMode.value}.png`"
    >
      <a-descriptions title="Information">
        <a-descriptions-item label="Discord">
          {{ tradingConfig.social.discord }}
        </a-descriptions-item>
        <a-descriptions-item label="Reddit">
          {{ tradingConfig.social.reddit }}
        </a-descriptions-item>
        <a-descriptions-item label="QQ">
          {{ tradingConfig.social.qq }}
        </a-descriptions-item>
      </a-descriptions>

      <a-alert
        v-if="errorText"
        type="error"
        message="Something went wrong"
        :description="errorText"
        show-icon
        closable
      />

      <a-divider v-if="draggableWantList.length">
        {{ tradingConfig.want.title }}
      </a-divider>

      <draggable
        :list="draggableWantList"
        item-key="id"
        group="group"
        class="ant-row draggable-row"
      >
        <template #item="{ element }">
          <a-col :key="element.id" :xs="12" :md="8" :lg="6" :xl="4">
            <a-card>
              <template #cover>
                <img loading="lazy" :alt="element.name" :src="element.img" />
              </template>
              <template #actions>
                <div @click="removeCap(element, 'want')">
                  <delete-outlined /> Remove
                </div>
              </template>

              <a-card-meta
                :title="colorwayTitle(element)"
                style="text-align: center"
              />
            </a-card>
          </a-col>
        </template>
      </draggable>

      <a-divider v-if="draggableHaveList.length && trading">
        {{ tradingConfig.have.title }}
      </a-divider>

      <draggable
        :list="draggableHaveList"
        item-key="id"
        group="group"
        class="ant-row draggable-row"
      >
        <template #item="{ element }">
          <a-col :key="element.id" :xs="12" :md="8" :lg="6" :xl="4">
            <a-card>
              <template #cover>
                <img loading="lazy" :alt="element.name" :src="element.img" />
              </template>
              <template #actions>
                <div @click="removeCap(element, 'have')">
                  <delete-outlined /> Remove
                </div>
              </template>

              <a-card-meta
                :title="colorwayTitle(element)"
                style="text-align: center"
              />
            </a-card>
          </a-col>
        </template>
      </draggable>
    </a-watermark>
  </a-card>
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
