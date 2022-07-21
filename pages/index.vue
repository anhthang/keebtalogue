<template>
  <div class="container">
    <a-page-header title="Calendar">
      <!-- <a-result
        v-if="$device.isMobile"
        status="warning"
        sub-title="Calendar is not compatible for mobile. Please use tablet or desktop."
      >
        <template #extra>
          <nuxt-link to="/keebs">
            <a-button type="primary"> Go Keebs </a-button>
          </nuxt-link>
          <nuxt-link to="/artisans/maker">
            <a-button type="primary"> Go Artisans </a-button>
          </nuxt-link>
        </template>
      </a-result> -->
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
import { message } from "ant-design-vue";

useHead({
  title: "Keeb Archivist",
});

const {
  data: sales,
  pending,
  refresh,
} = await useAsyncData(() =>
  $fetch("/api/firestore/query?col=artisan-sales").catch((error) => {
    return [];
  })
);

onMounted(() => {
  refresh();
});

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
