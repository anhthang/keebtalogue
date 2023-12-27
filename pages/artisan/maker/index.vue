<template>
  <div class="container maker-container">
    <a-spin :spinning="pending">
      <a-page-header title="Artisan Makers">
        <template v-if="isAdmin" #extra>
          <a-button type="primary" @click="showModal">
            <user-add-outlined /> Add
          </a-button>
        </template>
        <a-modal
          v-model:open="visible"
          title="New Maker"
          destroy-on-close
          :confirm-loading="confirmLoading"
          @ok="addMaker"
        >
          <modal-maker-form ref="makerForm" />
        </a-modal>

        <a-divider
          v-if="authenticated && favoriteMakers.length"
          orientation="left"
        >
          Pinned
        </a-divider>

        <a-row
          v-if="authenticated && favoriteMakers.length"
          :gutter="[8, 8]"
          type="flex"
        >
          <a-col
            v-for="maker in favoriteMakers"
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

        <a-divider
          v-if="authenticated && favoriteMakers.length"
          orientation="left"
        >
          Others
        </a-divider>

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
      </a-page-header>
    </a-spin>
  </div>
</template>

<script setup>
useSeoMeta({
  title: 'Artisan Makers',
})

const { data: makers, pending } = await useAsyncData('artisan-makers', () =>
  $fetch('/api/makers'),
)

const userStore = useUserStore()
const { authenticated, isAdmin, favorites } = storeToRefs(userStore)

const visible = ref(false)
const showModal = () => {
  visible.value = !visible.value
}

const favoriteMakers = computed(() => {
  return makers.value.filter((m) => favorites.value.includes(m.id))
})

const otherMakers = computed(() => {
  return makers.value.filter((m) => !favorites.value.includes(m.id))
})

const makerForm = ref()
const confirmLoading = ref(false)
const addMaker = async () => {
  confirmLoading.value = true

  await makerForm.value
    .addMaker()
    .then(() => {
      confirmLoading.value = false
      showModal()
    })
    .catch(() => {
      confirmLoading.value = false
    })
}
</script>

<style>
.maker-container {
  .ant-card {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .ant-card-cover {
    display: flex;
    align-items: center;
    flex: 1;
    margin: 25px;
    /* background: white; */
  }
}
</style>
