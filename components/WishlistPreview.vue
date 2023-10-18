<template>
  <a-card title="Preview" size="small" class="wishlist-preview">
    <template #extra>
      <a-tooltip>
        <template #title>Copy trading text to clipboard</template>
        <a-button type="primary" @click="copyToClipboard">
          <copy-outlined /> Copy
        </a-button>
      </a-tooltip>

      <a-button
        v-if="isAdmin"
        :loading="loading"
        type="primary"
        @click="generateImg"
      >
        <download-outlined /> Download
      </a-button>
    </template>

    <div v-if="base64Img" class="preview-img">
      <a-card-meta
        description="Place your finger on the photo and hold it on the image until a menu
      appears on the screen. Tap Save to download it."
      />
      <img :src="`data:image/png;base64,${base64Img}`" alt="" />
    </div>

    <div class="artisan-container">
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
        message="Some items in your list is updated. Please remove it to continue."
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
            <a-card :title="cardTitle(element)" size="small" :bordered="false">
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
    </div>
  </a-card>
</template>

<script setup>
import { message, Modal } from 'ant-design-vue'
import copy from 'ant-design-vue/lib/_util/copy-to-clipboard'
import groupBy from 'lodash.groupby'
import { storeToRefs } from 'pinia'
import draggable from 'vuedraggable'
import { useUserStore } from '~~/stores/user'

const userStore = useUserStore()
const { authenticated, user, isAdmin, wishlistConfig } = storeToRefs(userStore)

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

const base64Img = ref()
const loading = ref(false)
const errorText = ref()
const generateImg = async () => {
  loading.value = true
  errorText.value = undefined

  await $fetch('/api/wishlist', {
    method: 'post',
    body: {
      settings: wishlistConfig.value,
      wishlist: draggableWishList.value,
      tradelist: wantToTrade.value ? draggableTradeList.value : [],
    },
  })
    .then((response) => {
      if (response.IsError) {
        const caps = draggableWishList.value
          .concat(draggableTradeList.value)
          .filter((c) => response.ErrorItems.includes(c.colorway_id))

        errorText.value = caps
          .map((c) => `${c.name} ${c.sculpt_name}`)
          .join(', ')
      } else {
        base64Img.value = response.Body
      }
    })
    .catch((error) => {
      message.error(error.message)
    })

  // if (isDesktop) {
  //   const link = document.createElement("a");
  //   link.setAttribute("download", "wishlist.png");
  //   link.setAttribute("href", `data:image/png;base64,${base64Img}`);
  //   link.click();
  // }

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
    title: 'Do you want to remove?',
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
  message.success('Your trading text has been copied to the clipboard!')
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
}

.preview-img img {
  width: 100%;
  margin-top: 0.75rem;
  margin-bottom: 0.75rem;
}

.draggable-row {
  display: flex;
  flex-flow: row wrap;
  margin-left: -0.25rem;
  margin-right: -0.25rem;
  row-gap: 0.5rem;
}
</style>
