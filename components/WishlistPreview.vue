<template>
  <a-card title="Preview" size="small" class="wishlist-preview">
    <template #extra>
      <!-- <a-radio-group v-model:value="showTextToCopy" button-style="solid">
        <a-radio-button :value="true"> <eye-outlined /> Show </a-radio-button>
        <a-radio-button :value="false">
          <eye-invisible-outlined /> Hide
        </a-radio-button>
      </a-radio-group> -->
      <a-button :loading="loading" type="primary" @click="generateImg">
        <download-outlined /> Download
      </a-button>
    </template>

    <a-textarea
      v-if="showTextToCopy"
      v-model:value="wishlistToText"
      auto-size
    />

    <div v-if="base64Img && !isDesktop" class="preview-img">
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

      <a-divider v-if="draggableWishList.length">
        {{ wishlistConfig.wish.title }}
      </a-divider>

      <draggable
        :list="draggableWishList"
        itemKey="id"
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
        itemKey="id"
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
import { message, Modal } from "ant-design-vue";
import { storeToRefs } from "pinia";
import draggable from "vuedraggable";
import { useUserStore } from "~~/stores/user";

const userStore = useUserStore();
const { authenticated, user, wishlistConfig } = storeToRefs(userStore);

const draggableWishList = ref([]);
const draggableTradeList = ref([]);
const showTextToCopy = ref(false);
const isDesktop = true;

const {
  data: collections,
  pending,
  refresh,
} = await useAsyncData(() => {
  if (authenticated.value) {
    return $fetch("/api/firestore/query", {
      params: { col: `users/${user.value.uid}/collections` },
    }).then((data) => {
      return data.reduce((out, cur) => {
        const { id, ...rest } = cur;
        out[id] = Object.values(rest);
        return out;
      }, {});
    });
  } else {
    return {};
  }
});

onMounted(() => {
  if (!authenticated.value) {
    const wish = JSON.parse(localStorage.getItem("KeebCatalogue_wish") || "{}");
    const trade = JSON.parse(
      localStorage.getItem("KeebCatalogue_trade") || "{}"
    );

    collections.value = {
      wish: Object.values(wish),
      trade: Object.values(trade),
    };
  }
});

watch(
  wishlistConfig,
  () => {
    draggableWishList.value =
      collections.value[wishlistConfig.value.wish.collection];
    if (wishlistConfig.value.trade.collection) {
      draggableTradeList.value =
        collections.value[wishlistConfig.value.trade.collection];
    }
  },
  { deep: true }
);

watch(authenticated, () => refresh());

const wantToTrade = computed(() => {
  return wishlistConfig.value.want_to === "trade";
});

const cardTitle = (clw) => `${clw.name} ${clw.sculpt_name}`;

const base64Img = ref();
const loading = ref(false);
const generateImg = async () => {
  loading.value = true;

  // this.saveSettings()

  await $fetch("/api/wishlist", {
    method: "post",
    body: {
      settings: wishlistConfig.value,
      wishlist: draggableWishList.value,
      tradelist: wantToTrade.value ? draggableTradeList.value : [],
    },
  })
    .then((response) => {
      base64Img.value = response.Body;
    })
    .catch((error) => {
      message.error(error.message);
    });

  // if (isDesktop) {
  //   const link = document.createElement("a");
  //   link.setAttribute("download", "wishlist.png");
  //   link.setAttribute("href", `data:image/png;base64,${base64Img}`);
  //   link.click();
  // }

  loading.value = false;
};

const wishlistToText = computed(() => {
  let text =
    `**${wishlistConfig.value.wish.title}**\n` +
    `${draggableWishList.value
      .map((c) => `- ${c.name} ${c.sculpt_name}`)
      .join("\n")}`;

  if (wantToTrade.value) {
    text +=
      `\n\n` +
      `**${wishlistConfig.value.trade.title}**\n` +
      `${draggableTradeList.value
        .map((c) => `- ${c.name} ${c.sculpt_name}`)
        .join("\n")}`;
  }

  return text;
});

const removeCap = (colorway, type) => {
  Modal.confirm({
    title: "Do you want to remove?",
    onOk() {
      if (type === "wish") {
        draggableWishList.value = draggableWishList.value.filter(
          (c) => c.id !== colorway.id
        );
      } else {
        draggableTradeList.value = draggableTradeList.value.filter(
          (c) => c.id !== colorway.id
        );
      }
    },
  });
};
</script>

<style>
.wishlist-preview {
  height: 100%;

  /* .ant-card-cover {
    @media (max-width: 1200px) {
      height: 220px;
    }

    @media (max-width: 992px) {
      height: 150px;
    }
  }

  @media (max-width: 576px) {
    margin-top: 12px;
  } */
}

.preview-img img {
  width: 100%;
  margin-top: 12px;
}

.draggable-row {
  margin-left: -4px;
  margin-right: -4px;
  row-gap: 8px;
}
</style>
