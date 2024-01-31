<template>
  <a-card class="marketplace-listing">
    <a-typography-title :level="5">
      <shop-outlined /> Public Trades
    </a-typography-title>

    <a-list
      item-layout="vertical"
      :data-source="trades"
      :pagination="{ pageSize: 10 }"
    >
      <template #renderItem="{ item }">
        <a-list-item>
          <template #actions>
            <a-tag v-if="item.type === 'buy'" color="blue">Buying</a-tag>
            <a-tag v-else color="orange">Selling</a-tag>

            <span v-if="authenticated">
              <comment-outlined /> {{ item.contact }}
            </span>
            <span v-else>
              <comment-outlined />
              <a-button type="link" @click="toggleShowLogin">Login</a-button>
            </span>

            <span>
              <history-outlined /> {{ formatDateTime(item.created_at) }}
            </span>
          </template>

          <a-typography-text strong>Wants:</a-typography-text>
          {{ item.message }}

          <template #extra>
            <a-avatar-group shape="square" :max-count="15" size="large">
              <a-tooltip
                v-for="cap in item.items"
                :key="cap.id"
                :title="colorwayTitle(cap)"
              >
                <a-avatar :alt="colorwayTitle(cap)" :src="cap.img" />
              </a-tooltip>
            </a-avatar-group>
          </template>
        </a-list-item>
      </template>

      <a-modal v-model:open="showLoginModal" destroy-on-close :footer="null">
        <modal-login />
      </a-modal>
    </a-list>
  </a-card>
</template>

<script setup>
const { data } = await useAsyncData(() => $fetch('/api/marketplace'))

const userStore = useUserStore()
const { authenticated, marketplaceCfg } = storeToRefs(userStore)

const trades = computed(() => {
  const { type } = marketplaceCfg.value
  return type === 'any' ? data.value : data.value.filter((i) => i.type === type)
}, [marketplaceCfg.value.type])

const showLoginModal = ref(false)
const toggleShowLogin = () => {
  showLoginModal.value = !showLoginModal.value
}
</script>

<style>
.marketplace-listing {
  height: 100%;
}
</style>
