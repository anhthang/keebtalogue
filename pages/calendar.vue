<template>
  <div class="container">
    <a-page-header title="Calendar">
      <a-result
        v-if="isMobile"
        status="warning"
        sub-title="Calendar is not compatible for your device. Please use tablet or desktop."
      >
        <template #extra>
          <nuxt-link to="/artisan/maker">
            <a-button type="primary"> Go Artisan Makers </a-button>
          </nuxt-link>
        </template>
      </a-result>
      <a-spin v-else :spinning="pending">
        <a-calendar v-model:value="currentDate" @change="onChange">
          <template #dateCellRender="{ current }">
            <a-badge
              v-for="sale in salesOnCell(current)"
              :key="sale.maker_id"
              :status="sale.type"
              :text="`${sale.maker.name} - ${sale.sculpt_name} - ${sale.title}`"
            />
          </template>
        </a-calendar>
      </a-spin>
    </a-page-header>
  </div>
</template>

<script setup>
import dayjs from 'dayjs'

const start = ref(dayjs().startOf('month').format('YYYY-MM-DD'))
const end = ref(dayjs().endOf('month').format('YYYY-MM-DD'))

const { $device } = useNuxtApp()
const { isMobile } = $device

const {
  data: sales,
  pending,
  refresh,
} = await useAsyncData(() =>
  isMobile
    ? []
    : $fetch('/api/sales', {
        params: {
          start: start.value,
          end: end.value,
        },
      }),
)

const salesOnCell = (day) => {
  const today = new Date().getDate()

  return sales.value
    .filter((d) => d.date === day.format('YYYY-MM-DD'))
    .map((d) => {
      const cellDate = day.date()
      let type
      if (cellDate < today) {
        type = 'success'
      } else if (cellDate === today) {
        type = 'processing'
      } else {
        type = 'warning'
      }
      return Object.assign(d, { type })
    })
}

const currentDate = ref(dayjs())

const onChange = (value) => {
  start.value = value.startOf('month').format('YYYY-MM-DD')
  end.value = value.endOf('month').format('YYYY-MM-DD')
  currentDate.value = value

  refresh()
}

onMounted(() => {
  refresh()
})
</script>

<style>
.ant-picker-calendar,
.ant-picker-panel {
  background: transparent !important;
}
</style>
