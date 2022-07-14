<template>
  <div class="container maker-container">
    <a-page-header title="Artisan Makers">
      <template #extra>
        <a-button
          type="primary"
          @click="showModal"
        >
          <user-add-outlined /> Add
        </a-button>
      </template>
      <a-modal
        v-model="visible"
        title="New Maker"
        destroy-on-close
        :confirm-loading="confirmLoading"
        @ok="addMaker"
      >
        <maker-form ref="artisanMaker" />
      </a-modal>

      <a-tabs :default-active-key="defaultTab">
        <a-tab-pane key="favorite">
          <template #tab>
            <star-outlined /> Favorite
          </template>

          <a-row :gutter="[8, 8]" type="flex">
            <a-col
              v-for="maker in favorite"
              :key="maker.id"
              :xs="12"
              :sm="12"
              :md="8"
              :lg="6"
              :xl="4"
            >
              <maker-card :favorite="true" :maker="maker" />
            </a-col>
          </a-row>
        </a-tab-pane>
        <a-tab-pane key="makers">
          <template #tab>
            <usergroup-add-outlined /> Makers
          </template>
          <a-row :gutter="[8, 8]" type="flex">
            <a-col
              v-for="maker in otherMakers"
              :key="maker.id"
              :xs="12"
              :sm="12"
              :md="8"
              :lg="6"
              :xl="4"
            >
              <maker-card :maker="maker" />
            </a-col>
          </a-row>
        </a-tab-pane>
      </a-tabs>
    </a-page-header>
  </div>
</template>

<script setup>
const makers = ["trmk", "artkey", "goldenstar-keycap"]
</script>