<template>
  <div class="container">
    <a-page-header title="Calendar">
      <a-calendar>
        <template #dateCellRender="{ current }">
          <a-badge
            v-for="sale in salesOnDay(current)"
            :key="sale.maker"
            :status="sale.type"
            :text="`${sale.maker} - ${sale.sculpt} - ${sale.title}`"
          />
        </template>
      </a-calendar>
    </a-page-header>
  </div>
</template>

<script setup>
const sales = ref([])

const salesOnDay = (day) => {
  const today = new Date().getDate();

  return sales.value
    .filter((d) => d.date === day.format("YYYY-MM-DD"))
    .map((d) => {
      const cellDate = day.date();
      let type;
      if (cellDate < today) {
        type = "success";
      } else if (cellDate === today) {
        type = "processing";
      } else {
        type = "warning";
      }
      return Object.assign(d, { type });
    });
};
</script>

<style>
.ant-picker-calendar,
.ant-picker-panel {
  background: transparent !important;
}
</style>