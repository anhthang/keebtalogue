<template>
  <div class="container">
    <a-page-header title="Marketplace">
      <a-row type="flex">
        <a-alert class="collection-alert" type="info" banner>
          <template #message>
            <a-typography-text strong> Early Access: </a-typography-text>
            This feature is still under development, so you may experience bugs
            or incomplete functionality.
          </template>
        </a-alert>
      </a-row>

      <a-row :gutter="[8, 8]">
        <a-col :xs="24" :md="12">
          <a-card title="Buying">
            <marketplace-listing :data="data.filter((c) => c.type === 'buy')" />
          </a-card>
        </a-col>

        <a-col :xs="24" :md="12">
          <a-card title="Selling">
            <marketplace-listing
              :data="data.filter((c) => c.type === 'sell')"
            />
          </a-card>
        </a-col>
      </a-row>
    </a-page-header>
  </div>
</template>

<script setup>
const { data } = await useAsyncData(() => $fetch('/api/marketplace'))
</script>
