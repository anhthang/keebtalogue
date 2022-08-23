<template>
  <div class="container maker-container">
    <a-page-header title="Artisan Makers">
      <template v-if="authenticated" #extra>
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
        <maker-form ref="makerForm" />
      </a-modal>

      <a-tabs v-model:activeKey="defaultTab">
        <a-tab-pane :disabled="!authenticated" key="favorite">
          <template #tab>
            <star-outlined />Favorite ({{ favoriteMakers.length }})
          </template>
          <a-row :gutter="[8, 8]" type="flex">
            <a-col
              v-for="maker in favoriteMakers"
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
          <template #tab>
            <usergroup-add-outlined />Makers ({{ otherMakers.length }})
          </template>
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
import { storeToRefs } from "pinia";
import MakerForm from "~~/components/modals/MakerForm.vue";
import { useUserStore } from "~~/stores/user";

useHead({
  title: "Artisan Makers",
});

const {
  data: makers,
  pending,
  refresh,
} = await useAsyncData(() => $fetch("/api/makers"));

const userStore = useUserStore();
const { authenticated, user, favorites } = storeToRefs(userStore);

const visible = ref(false);
const showModal = () => {
  visible.value = !visible.value;
};

const defaultTab = ref(favorites.value.length ? "favorite" : "makers");
watch(
  () => favorites.value.length,
  () => {
    defaultTab.value = "favorite";
  }
);

const favoriteMakers = computed(() => {
  return makers.value.filter((m) => favorites.value.includes(m.id));
});
const otherMakers = computed(() => {
  return makers.value.filter((m) => !favorites.value.includes(m.id));
});

const makerForm = ref();
const confirmLoading = ref(false);
const addMaker = async () => {
  confirmLoading.value = true;

  await makerForm.value.addMaker();

  confirmLoading.value = false;
};
</script>

<style>
.favorite-maker {
  color: #eb2f96;
}
</style>