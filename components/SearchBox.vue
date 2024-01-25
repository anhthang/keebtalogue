<template>
  <a-auto-complete
    v-model:value="value"
    allow-clear
    :options="dataSources"
    @select="onSelect"
    @search="handleSearch"
  >
    <template #option="item">
      <template v-if="item.options">
        <span>
          {{ item.name }}
        </span>
      </template>
      <template v-else>
        <div :style="{ display: 'flex', justifyContent: 'space-between' }">
          {{ item.name }}
        </div>
      </template>
    </template>
    <a-input placeholder="Search...">
      <template #prefix><search-outlined /></template>
    </a-input>
  </a-auto-complete>
</template>

<script setup>
const value = ref('')
const dataSources = ref([])

const handleSearch = async (query) => {
  const { data } = await useAsyncData(() =>
    $fetch('/api/search', { params: { query } }),
  )

  dataSources.value = data.value.data
}

const router = useRouter()
const onSelect = async (path) => {
  value.value = ''
  dataSources.value = []

  router.push(path)
}
</script>
