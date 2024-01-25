<template>
  <a-list
    item-layout="vertical"
    :data-source="data"
    :pagination="{ pageSize: 10, size: 'small' }"
  >
    <template #renderItem="{ item }">
      <a-list-item>
        <template #actions>
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
          <a-avatar-group shape="square" :max-count="8" size="large">
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
</template>

<script setup>
const { data } = defineProps({
  data: {
    type: Array,
    default() {
      return []
    },
  },
})

const userStore = useUserStore()
const { authenticated } = storeToRefs(userStore)

const showLoginModal = ref(false)
const toggleShowLogin = () => {
  showLoginModal.value = !showLoginModal.value
}
</script>
