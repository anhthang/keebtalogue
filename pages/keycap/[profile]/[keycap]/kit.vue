<template>
  <div class="container">
    <a-spin :spinning="pending">
      <a-page-header v-if="data" title="Manage Kits">
        <template #breadcrumb>
          <a-breadcrumb>
            <a-breadcrumb-item> Keycap </a-breadcrumb-item>
            <a-breadcrumb-item>
              <nuxt-link :to="`/keycap/${data.profile_id}`">
                {{ manufacturers[data.profile_id] }}
              </nuxt-link>
            </a-breadcrumb-item>
            <a-breadcrumb-item>
              <nuxt-link :to="`/keycap/${data.profile_keycap_id}`">
                {{ data.name }}
              </nuxt-link>
            </a-breadcrumb-item>
            <a-breadcrumb-item>Kits</a-breadcrumb-item>
          </a-breadcrumb>
        </template>

        <template #extra>
          <a-button type="primary" @click="toggleShowEditKit()">
            <appstore-add-outlined /> Add
          </a-button>
        </template>
        <a-table :data-source="data.kits" :columns="columns">
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'img'">
              <a :href="record.img" target="_blank">Link</a>
            </template>

            <template v-if="column.key === 'status' && !!record.cancelled">
              <a-tag color="red">Cancelled</a-tag>
            </template>

            <template v-if="column.key === 'action'">
              <a-button @click="toggleShowEditKit(record)">
                <edit-outlined /> Edit
              </a-button>
            </template>
          </template>
        </a-table>
      </a-page-header>

      <a-modal
        v-model:open="showEditKit"
        :title="selectedKit?.id ? 'Edit Kit' : 'Add Kit'"
        destroy-on-close
        :confirm-loading="confirmLoading"
        @ok="addKeycapKit"
      >
        <modal-keycap-kit-form
          ref="keycapKitForm"
          :is-edit="!!selectedKit?.id"
          :metadata="selectedKit"
        />
      </a-modal>
    </a-spin>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth',
})

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Price',
    dataIndex: 'price',
    key: 'price',
  },
  {
    title: 'Quantity',
    dataIndex: 'qty',
    key: 'qty',
  },
  {
    title: 'Image',
    dataIndex: 'img',
    key: 'img',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
  },
  {
    title: 'Action',
    key: 'action',
  },
]

const route = useRoute()
const { profile, keycap } = route.params

const { data, pending, refresh } = await useAsyncData(
  `keycap/${profile}/${keycap}`,
  () => $fetch(`/api/keycaps/${profile}/${keycap}`),
)

useSeoMeta({
  title: data.value
    ? `${manufacturers[profile]} ${data.value.name} - Manage Kits`
    : manufacturers[profile],
})

const showEditKit = ref(false)
const selectedKit = ref({})

const toggleShowEditKit = (kit) => {
  showEditKit.value = !showEditKit.value
  selectedKit.value = kit
}

const keycapKitForm = ref()
const confirmLoading = ref(false)

const addKeycapKit = async () => {
  confirmLoading.value = true

  await keycapKitForm.value
    .addKit()
    .then(() => {
      confirmLoading.value = false
      toggleShowEditKit()
      refresh()
    })
    .catch(() => {
      confirmLoading.value = false
    })
}
</script>
