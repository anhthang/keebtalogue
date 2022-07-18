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
      <!-- <a-button
        :loading="loading"
        type="primary"
        icon="download"
        @click="generateImg"
      >
        Download
      </a-button> -->
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
          {{ wishlishConfig.social.discord }}
        </a-descriptions-item>
        <a-descriptions-item label="Reddit">
          {{ wishlishConfig.social.reddit }}
        </a-descriptions-item>
      </a-descriptions>

      <a-divider v-if="draggableWishList.length">
        {{ wishlishConfig.wish.title }}
      </a-divider>

      <draggable :list="draggableWishList" itemKey="id" group="group">
        <template #item="{ element }">
          <a-row :gutter="[8, 8]">
            <a-col :key="element.id" :xs="12" :md="8" :xl="6">
              <a-card
                :title="cardTitle(element)"
                size="small"
                :bordered="false"
              >
                <template #cover>
                  <img loading="lazy" :alt="element.name" :src="element.img" />
                </template>
                <template #extra>
                  <delete-outlined @click="removeCap(element, 'wish')" />
                </template>
              </a-card>
            </a-col>
          </a-row>
        </template>
      </draggable>

      <a-divider v-if="draggableTradeList.length && wantToTrade">
        {{ wishlishConfig.trade.title }}
      </a-divider>

      <draggable :list="draggableTradeList" itemKey="id" group="group">
        <template #item="{ element }">
          <a-row v-if="wantToTrade" :gutter="[8, 8]">
            <a-col :key="element.id" :xs="12" :md="8" :xl="6">
              <a-card
                :title="cardTitle(element)"
                size="small"
                :bordered="false"
              >
                <template #cover>
                  <img loading="lazy" :alt="element.name" :src="element.img" />
                </template>
                <template #extra>
                  <delete-outlined @click="removeCap(element, 'trade')" />
                </template>
              </a-card>
            </a-col>
          </a-row>
        </template>
      </draggable>
    </div>
  </a-card>
</template>

<script setup>
import { storeToRefs } from "pinia";
import draggable from "vuedraggable";
import { useUserStore } from "~~/stores/user";

const userStore = useUserStore();
const { social, user, wishlishConfig } = storeToRefs(userStore);

const draggableWishList = ref([]);
const draggableTradeList = ref([]);
const base64Img = ref();
const isDesktop = true;

const { data: collections, pending } = await useAsyncData(() =>
  $fetch("/api/firestore/query", {
    params: { col: `users/${user.uid}/collections` },
  }).then((data) => {
    return data.reduce((out, cur) => {
      const { id, ...rest } = cur;
      out[id] = Object.values(rest);
      return out;
    }, {});
  })
);

// watch(pending, () => {
//   draggableWishList.value =
//     collections.value[wishlishConfig.value.wish.collection];
// });

const wantToTrade = computed(() => {
  return wishlishConfig.value.want_to === "trade";
});

const cardTitle = (clw) => `${clw.name} ${clw.sculpt_name}`;

// export default {
//   computed: {
//     kaSettings() {
//       return {
//         capsPerLine: this.wishlistSettings.caps_per_line,
//         priority: {
//           color: "DarkGoldenRod",
//           font: "RedRock",
//         },
//         legends: {
//           color: "Orchid",
//           font: "Roboto",
//         },
//         title: {
//           color: "Crimson",
//           font: "RedRock",
//           text: this.wishlistSettings.wish.title,
//         },
//         tradeTitle: {
//           color: "Orchid",
//           font: "RedRock",
//           text: this.wishlistSettings.trade.title,
//         },
//         extraText: {
//           color: "Turquoise",
//           font: "Roboto",
//           text: "Willing to topup if needed",
//         },
//         background: {
//           color: "Black",
//         },
//         social: {
//           reddit: this.wishlistSettings.social.reddit,
//           discord: this.wishlistSettings.social.discord,
//         },
//       };
//     },
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
//   watch: {
//     wishlistSettings: {
//       handler(after, before) {
//         if (after.wish.collection !== before.wish.collection) {
//           this.draggableWishList = this.collection[after.wish.collection];
//         }
//         if (after.trade.collection !== before.trade.collection) {
//           this.draggableTradeList = this.collection[after.trade.collection];
//         }
//       },
//       deep: true,
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
//     async generateImg() {
//       this.loading = true;

//       // this.saveSettings()

//       const json = {
//         settings: this.kaSettings,
//         caps: this.draggableWishList.map((i) => ({
//           id: i.id,
//           isPriority: false,
//           legendColor: "Crimson",
//         })),
//         tradeCaps: this.wantToTrade
//           ? this.draggableTradeList.map((i) => ({
//               id: i.id,
//               isPriority: false,
//               legendColor: "Orchid",
//             }))
//           : [],
//       };

//       this.base64Img = await this.$axios
//         .post("https://app.keycap-archivist.com/api/v2/wishlist", json, {
//           responseType: "arraybuffer",
//         })
//         .then((response) => {
//           this.loading = false;
//           return Buffer.from(response.data, "binary").toString("base64");
//         })
//         .catch((e) => {
//           this.loading = false;
//         });

//       if (this.$device.isDesktop) {
//         const link = document.createElement("a");
//         link.setAttribute("download", "wishlist.png");
//         link.setAttribute("href", `data:image/png;base64,${this.base64Img}`);
//         link.click();
//       }

//       this.loading = false;
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
</style>
