<template>
  <a-card title="Preview" class="wishlist-preview">
    <template #extra>
      <a-tooltip>
        <template #title>Copy trading text to clipboard</template>
        <a-button @click="copyToClipboard"> <copy-outlined /> Copy </a-button>
      </a-tooltip>

      <a-button :loading="loading" @click="generateImg">
        <file-image-outlined /> Download
      </a-button>
    </template>

    <a-descriptions title="Information">
      <a-descriptions-item label="Discord">
        {{ wishlistConfig.social.discord }}
      </a-descriptions-item>
      <a-descriptions-item label="Reddit">
        {{ wishlistConfig.social.reddit }}
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

    <a-divider v-if="draggableWishList.length">
      {{ wishlistConfig.wish.title }}
    </a-divider>

    <draggable
      :list="draggableWishList"
      item-key="id"
      group="group"
      class="ant-row draggable-row"
    >
      <template #item="{ element }">
        <a-col :key="element.id" :xs="12" :md="8" :xl="6">
          <a-card :title="cardTitle(element)">
            <template #cover>
              <img loading="lazy" :alt="element.name" :src="element.img" />
            </template>
            <template #extra>
              <delete-outlined @click="removeCap(element, 'wish')" />
            </template>
          </a-card>
        </a-col>
      </template>
    </draggable>

    <a-divider v-if="draggableTradeList.length && wantToTrade">
      {{ wishlistConfig.trade.title }}
    </a-divider>

    <draggable
      :list="draggableTradeList"
      item-key="id"
      group="group"
      class="ant-row draggable-row"
    >
      <template #item="{ element }">
        <a-col :key="element.id" :xs="12" :md="8" :xl="6">
          <a-card :title="cardTitle(element)" size="small" :bordered="false">
            <template #cover>
              <img loading="lazy" :alt="element.name" :src="element.img" />
            </template>
            <template #extra>
              <delete-outlined @click="removeCap(element, 'trade')" />
            </template>
          </a-card>
        </a-col>
      </template>
    </draggable>
  </a-card>
</template>

<script setup>
import { message, Modal } from 'ant-design-vue'
import copy from 'ant-design-vue/lib/_util/copy-to-clipboard'
import html2canvas from 'html2canvas'
import groupBy from 'lodash.groupby'
import { storeToRefs } from 'pinia'
import draggable from 'vuedraggable'
import { useUserStore } from '~~/stores/user'

const userStore = useUserStore()
const { authenticated, user, wishlistConfig } = storeToRefs(userStore)

const draggableWishList = ref([])
const draggableTradeList = ref([])

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
    const wish = JSON.parse(localStorage.getItem('Keebtalogue_wish') || '[]')
    const trade = JSON.parse(localStorage.getItem('Keebtalogue_trade') || '[]')

    collections.value = {
      wish: Object.values(wish),
      trade: Object.values(trade),
    }
  }
})

watch(
  wishlistConfig,
  () => {
    draggableWishList.value =
      collections.value[wishlistConfig.value.wish.collection] || []
    if (wishlistConfig.value.trade.collection) {
      draggableTradeList.value =
        collections.value[wishlistConfig.value.trade.collection] || []
    }
  },
  { deep: true },
)

watch(authenticated, () => refresh())

const wantToTrade = computed(() => {
  return wishlistConfig.value.want_to === 'trade'
})

const cardTitle = (clw) => `${clw.name} ${clw.sculpt_name}`

const loading = ref(false)
const errorText = ref()
const generateImg = async () => {
  loading.value = true

  const el = document.getElementsByClassName('wishlist-preview')[0]

  // hide some items for rendering
  const cardHead = el.getElementsByClassName('ant-card-head')[0]
  const bodyExtras = el
    .getElementsByClassName('ant-card-body')[0]
    .getElementsByClassName('ant-card-extra')

  cardHead.classList.add('wishlist-hide')
  bodyExtras.forEach((ex) => {
    ex.classList.add('wishlist-hide')
  })

  try {
    const options = {
      type: 'dataURL',
      useCORS: true,
      logging: false,
    }
    const canvas = await html2canvas(el, options)
    const link = document.createElement('a')
    link.setAttribute('download', 'wishlist.png')
    link.setAttribute(
      'href',
      canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream'),
    )
    link.click()
  } catch (error) {
    errorText.value = error.message
  }

  // revert
  cardHead.classList.remove('wishlist-hide')
  bodyExtras.forEach((ex) => {
    ex.classList.remove('wishlist-hide')
  })

  loading.value = false
}

const wishlistToText = computed(() => {
  let text =
    `**${wishlistConfig.value.wish.title}**\n` +
    `${draggableWishList.value
      .map((c) => `- ${c.name} ${c.sculpt_name}`)
      .join('\n')}`

  if (wantToTrade.value) {
    text +=
      `\n\n` +
      `**${wishlistConfig.value.trade.title}**\n` +
      `${draggableTradeList.value
        .map((c) => `- ${c.name} ${c.sculpt_name}`)
        .join('\n')}`
  }

  return text
})

const removeCap = (colorway, type) => {
  Modal.confirm({
    title: 'Remove Artisan',
    content: 'Are you sure you want to continue?',
    onOk() {
      if (type === 'wish') {
        draggableWishList.value = draggableWishList.value.filter(
          (c) => c.id !== colorway.id,
        )
      } else {
        draggableTradeList.value = draggableTradeList.value.filter(
          (c) => c.id !== colorway.id,
        )
      }
    },
  })
}

const copyToClipboard = () => {
  copy(wishlistToText.value)
  message.success('Copied to clipboard!')
}
</script>

<style>
.wishlist-preview {
  height: 100%;

  .ant-card-extra {
    button {
      margin-left: 0.5rem;
    }
  }

  .ant-divider-inner-text {
    font-family: 'Bungee Spice', cursive;
    font-size: 2rem;
  }

  .wishlist-hide {
    display: none;
  }

  .ant-card-body {
    .ant-card-head-title {
      text-align: center;
    }
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
