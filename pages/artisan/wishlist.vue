<template>
  <div class="container">
    <a-page-header title="Wishlist">
      <a-row :gutter="8" type="flex">
        <a-col :xs="24" :md="8" :lg="6">
          <wishlist-settings />
        </a-col>
        <a-col :xs="24" :md="16" :lg="18">
          <wishlist-preview />
        </a-col>
      </a-row>
    </a-page-header>
  </div>
</template>

<script setup>
useSeoMeta({
  title: 'Wishlist',
  description: 'Create eye-catching wishlist images for seamless trading!',
})
</script>
