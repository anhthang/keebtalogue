<template>
  <a-card title="Theme preferences" :bordered="false" size="small">
    <a-card-meta class="appearance-meta">
      <template #description>
        <span>
          Choose how the website looks to you. Select a single theme, or sync
          with your system and automatically switch between day and night
          themes.
        </span>
      </template>
    </a-card-meta>

    <a-row>
      <a-col :xs="24" :sm="16">
        <a-form-item>
          <a-radio-group
            v-model:value="$colorMode.preference"
            class="color-mode-radio"
          >
            <a-radio value="system"> ⚙️ System </a-radio>
            <a-radio disabled value="light"> 🌞 Light </a-radio>
            <a-radio disabled value="dark"> 🌛 Dark </a-radio>
          </a-radio-group>
        </a-form-item>
      </a-col>
    </a-row>
  </a-card>
</template>

<style lang="postcss" scoped>
.color-mode-radio {
  .ant-radio-wrapper {
    @apply block h-8 leading-8
  }
}
</style>