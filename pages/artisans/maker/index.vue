<template>
  <div class="container maker-container" v-if="!pending">
    <a-page-header title="Artisan Makers">
      <template #extra>
        <a-button type="primary" @click="showModal">
          <user-add-outlined /> Add
        </a-button>
      </template>
      <a-modal
        v-model:visible="visible"
        title="New Maker"
        destroy-on-close
        :confirm-loading="confirmLoading"
        @ok="addMaker"
      >
        <maker-form ref="artisanMaker" />
      </a-modal>

      <a-tabs :default-active-key="defaultTab">
        <a-tab-pane key="favorite">
          <template #tab><star-outlined />Favorite</template>

          <a-row :gutter="[8, 8]" type="flex">
            <a-col
              v-for="maker in favorite"
              :key="maker.id"
              :xs="12"
              :sm="12"
              :md="8"
              :lg="6"
              :xl="4"
            >
              <maker-card :favorite="true" :maker="maker" />
            </a-col>
          </a-row>
        </a-tab-pane>
        <a-tab-pane key="makers">
          <template #tab><usergroup-add-outlined />Makers</template>
          <a-row :gutter="[8, 8]" type="flex">
            <a-col
              v-for="maker in otherMakers"
              :key="maker.id"
              :xs="12"
              :sm="12"
              :md="8"
              :lg="6"
              :xl="4"
            >
              <maker-card :maker="maker" />
            </a-col>
          </a-row>
        </a-tab-pane>
      </a-tabs>
    </a-page-header>
  </div>
</template>

<script setup>
import MakerForm from "~~/components/modals/MakerForm.vue";

useHead({
  title: "Artisan Makers | Keeb Archivist",
});

const { data, pending, refresh } = await useAsyncData(() =>
  $fetch("/api/firestore/query?col=artisan-makers")
);

const favoriteMakers = ["artkey", "goldenstar-keycap", "trmk", "t-lab"];

const favorite = data.value.result.filter((m) => favoriteMakers.includes(m.id));
const otherMakers = data.value.result.filter(
  (m) => !favoriteMakers.includes(m.id)
);
const defaultTab = favoriteMakers.length ? "favorite" : "makers";

const visible = ref(false);
const showModal = () => {
  visible.value = !visible.value;
};
</script>

<script>
export default {
  data() {
    return {
      confirmLoading: false,
    };
  },
  methods: {
    async addMaker() {
      this.confirmLoading = true;

      await this.$refs.artisanMaker.addMaker();

      this.confirmLoading = false;
      this.visible = false;

      // this.$fetch();
    },
  },
};
</script>

<style lang="less">
.favorite-maker {
  color: #eb2f96 !important;
}
</style>