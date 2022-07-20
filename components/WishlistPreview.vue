<template>
  <a-card title="Preview" size="small" class="wishlist-preview">
    <template #extra>
      <!-- <a-button
        v-clipboard:copy="wishlistToText"
        v-clipboard:success="onCopy"
        type="primary"
        icon="copy"
      >
        Copy Text
      </a-button> -->
      <a-button :loading="loading" type="primary" @click="generateImg">
        <download-outlined /> Download
      </a-button>
    </template>

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
import { message } from "ant-design-vue";
import cloneDeep from "lodash.clonedeep";
import { storeToRefs } from "pinia";
import draggable from "vuedraggable";
import { useUserStore } from "~~/stores/user";

const userStore = useUserStore();
const { user, wishlistConfig } = storeToRefs(userStore);

const draggableWishList = ref([]);
const draggableTradeList = ref([]);
const isDesktop = true;

const { data: collections, pending } = await useAsyncData(() =>
  $fetch("/api/firestore/query", {
    params: { col: `users/${user.value.uid}/collections` },
  }).then((data) => {
    return data.reduce((out, cur) => {
      const { id, ...rest } = cur;
      out[id] = Object.values(rest);
      return out;
    }, {});
  })
);

// clone deep can watch nested object
watch(
  () => cloneDeep(wishlistConfig.value),
  () => {
    draggableWishList.value =
      collections.value[wishlistConfig.value.wish.collection];
    if (wishlistConfig.value.trade.collection) {
      draggableTradeList.value =
        collections.value[wishlistConfig.value.trade.collection];
    }
  }
);

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

// export default {
//   computed: {
//     wishlistToText() {
//       let text =
//         `**${this.wishlistSettings.wish.title}**\n` +
//         `${this.draggableWishList
//           .map((c) => `- ${c.name} ${c.sculpt_name}`)
//           .join("\n")}`;

//       if (this.wantToTrade) {
//         text +=
//           `\n\n` +
//           `**${this.wishlistSettings.trade.title}**\n` +
//           `${this.draggableTradeList
//             .map((c) => `- ${c.name} ${c.sculpt_name}`)
//             .join("\n")}`;
//       }

//       return text;
//     },
//   },
//   methods: {
//     onCopy() {
//       this.$message.success("Wishlist text copied!");
//     },
//     async getUserCollections() {
//       if (this.user.emailVerified) {
//         await this.$fire.firestore
//           .collection(`users/${this.user.uid}/collections`)
//           .get()
//           .then((doc) => {
//             doc.docs.forEach((d) => {
//               this.collection[d.id] = Object.values(d.data()).filter(
//                 (c) => !c.gotcha
//               );
//             });
//           });
//       } else {
//         const wish = JSON.parse(localStorage.getItem(`KeebCatalogue_wish`));
//         const trade = JSON.parse(localStorage.getItem(`KeebCatalogue_trade`));
//         this.collection = {
//           wish: Object.values(wish || {}).filter((c) => !c.gotcha),
//           trade: Object.values(trade || {}).filter((c) => !c.gotcha),
//         };
//       }
//     },
//     removeCap(colorway, type) {
//       const vm = this;
//       this.$confirm({
//         title: "Do you want to remove this keycap?",
//         content: "Once confirmed, this action cannot be undone.",
//         onOk() {
//           if (type === "wish") {
//             vm.draggableWishList = vm.draggableWishList.filter(
//               (i) => i.id !== colorway.id
//             );
//           } else {
//             vm.draggableTradeList = vm.draggableTradeList.filter(
//               (i) => i.id !== colorway.id
//             );
//           }
//         },
//       });
//     },
//   },
// };
</script>

<style lang="less">
.wishlist-preview {
  height: 100%;

  .ant-card-cover {
    @media (max-width: 1200px) {
      height: 220px;
    }

    @media (max-width: 992px) {
      height: 150px;
    }
  }

  @media (max-width: 576px) {
    margin-top: 12px;
  }
}

.preview-img {
  img {
    width: 100%;
    margin-top: 12px;
  }
}

.draggable-row {
  margin-left: -4px;
  margin-right: -4px;
  row-gap: 8px;
}
</style>
