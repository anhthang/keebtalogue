<template>
  <div class="container">
    <a-page-header title="Trading">
      <a-row :gutter="8" type="flex">
        <a-col :xs="24" :md="8" :lg="6">
          <trading-settings />
        </a-col>
        <a-col :xs="24" :md="16" :lg="18">
          <trading-preview />
        </a-col>
      </a-row>
    </a-page-header>
  </div>
</template>

<script setup>
useSeoMeta({
  title: 'Trading',
})
</script>
