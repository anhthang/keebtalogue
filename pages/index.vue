<template>
  <div class="container">
    <a-page-header title="Overview">
      <a-flex vertical gap="middle">
        <a-row :gutter="[16, 16]">
          <a-col :xs="24" :md="12">
            <a-card class="recently-added">
              <a-typography-title :level="5">
                <history-outlined /> Artisans - Recently Added
              </a-typography-title>
              <recently-added :makers="data.makers" />
            </a-card>
          </a-col>
          <a-col :xs="24" :md="12">
            <a-card class="recently-added">
              <a-typography-title :level="5">
                <history-outlined /> Keycaps - Live Group Buys
              </a-typography-title>
              <keycap-live-group-buys :keycaps="data.keycaps" />
            </a-card>
          </a-col>
        </a-row>

        <a-row :gutter="[16, 16]">
          <a-col :xs="24">
            <a-card class="guides">
              <a-typography-title :level="5">
                <read-outlined /> Artisan Collector Guides
              </a-typography-title>
              <artisan-collector-guide />
            </a-card>
          </a-col>
        </a-row>
      </a-flex>
    </a-page-header>
  </div>
</template>

<script setup>
const { data } = await useAsyncData(() => $fetch('/api/statistics'))
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  max-width: 1600px;
}

.guides {
  height: 100%;
}

.recently-added {
  height: 100%;
}
</style>
