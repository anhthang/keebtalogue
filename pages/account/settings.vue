<template>
  <div class="container">
    <a-page-header title="Settings">
      <a-card>
        <a-tabs v-model:activeKey="activeKey" :tab-position="tabPosition">
          <a-tab-pane key="profile">
            <template #tab><user-outlined /> Public Profile </template>
            <account-profile />
          </a-tab-pane>
        </a-tabs>
      </a-card>
    </a-page-header>
  </div>
</template>

<script setup>
useSeoMeta({
  title: 'Account Settings',
})

definePageMeta({
  middleware: 'auth',
})

const { isMobile } = useDevice()

const tabPosition = isMobile ? 'top' : 'left'
const activeKey = ref('profile')
</script>
