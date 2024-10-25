<template>
  <AutoComplete
    v-model="searchText"
    :suggestions="dataSources"
    fluid
    option-label="title"
    option-group-label="title"
    option-group-children="options"
    placeholder="Search for artisan keycaps, keycap sets and more..."
    @option-select="onSelect"
    @complete="handleSearch"
  >
  </AutoComplete>
</template>

<script setup>
const searchText = ref('')
const dataSources = ref([])

const handleSearch = async ({ query }) => {
  const { data } = await useAsyncData(() =>
    $fetch('/api/search', { params: { query } }),
  )

  dataSources.value = data.value.data
}

const router = useRouter()
const onSelect = async (option) => {
  searchText.value = ''
  dataSources.value = []

  router.push(option.value.value)
}
</script>
