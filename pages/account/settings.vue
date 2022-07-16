<template>
  <div class="container">
    <a-page-header title="Settings">
      <a-card>
        <a-tabs v-model:activeKey="activeKey" :tab-position="tabPosition">
          <a-tab-pane key="profile" tab="Profile">
            <setting-profile />
          </a-tab-pane>
          <a-tab-pane key="appearance" tab="Appearance">
            <setting-appearance />
          </a-tab-pane>
        </a-tabs>
      </a-card>
    </a-page-header>
  </div>
</template>

<script setup>
import SettingAppearance from '~~/components/accounts/SettingAppearance.vue'
import SettingProfile from '~~/components/accounts/SettingProfile.vue'

useHead({
  title: "Account Setting | Keeb Archivist"
})

const tabPosition = 'top'
const activeKey = ref("profile")
</script>
