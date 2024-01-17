<template>
  <div class="container">
    <a-page-header title="Marketplace">
      <a-list item-layout="horizontal" :data-source="data">
        <template #renderItem="{ item }">
          <a-list-item>
            <a-list-item-meta :title="item.name" :description="item.message" />

            <template #extra>
              <a-avatar-group shape="square">
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
      </a-list>
    </a-page-header>
  </div>
</template>

<script setup>
const { data } = await useAsyncData(() => $fetch('/api/marketplace'))
</script>
