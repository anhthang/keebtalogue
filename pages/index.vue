<template>
  <div class="container">
    <a-page-header title="Home">
      <a-flex :vertical="$device.isMobile" gap="small">
        <a-col :xs="24" :md="16">
          <a-card class="guides">
            <a-typography-title :level="5">
              <read-outlined /> ArtisanCollector's Guides
            </a-typography-title>
            <artisan-collector-guide />
          </a-card>
        </a-col>

        <a-col :xs="24" :md="8">
          <a-flex vertical gap="small">
            <a-card v-if="data.makers.length" class="recently-added-artisans">
              <a-typography-title :level="5">
                <history-outlined /> Recently Added Artisans
              </a-typography-title>
              <recently-added :makers="data.makers" />
            </a-card>

            <a-card v-if="data.keycaps.length" class="live-gb-keycaps">
              <a-typography-title :level="5">
                <rise-outlined /> Live Group Buys Keycaps
              </a-typography-title>
              <keycap-live-group-buys :keycaps="data.keycaps" />
            </a-card>
          </a-flex>
        </a-col>
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
  min-height: calc(100vh - 128px); /** minus header & footer */
  display: flex;
  flex-direction: column;
  max-width: 1600px;
}

.guides {
  height: 100%;
}

.recently-added-artisans {
  height: 100%;

  .ant-spin-nested-loading {
    min-height: auto;
  }
}

/* Global */
.alert-banner {
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 1rem;
}
</style>
