<template>
  <div class="container">
    <a-page-header title="Overview">
      <a-row :gutter="[8, 8]">
        <a-col :xs="24" :md="16">
          <a-card class="guides">
            <a-typography-title :level="5">
              <read-outlined /> Artisan Collector Guides
            </a-typography-title>
            <artisan-collector-guide />
          </a-card>
        </a-col>

        <a-col :xs="24" :md="8">
          <a-card class="recently-added">
            <a-typography-title :level="5">
              <history-outlined /> Recently Added
            </a-typography-title>
            <recently-added />
          </a-card>
        </a-col>
      </a-row>
    </a-page-header>
  </div>
</template>

<style>
.guides {
  height: 100%;
}

.recently-added {
  height: 100%;
}
</style>
