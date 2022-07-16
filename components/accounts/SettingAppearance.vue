<template>
  <a-card title="Theme preferences" :bordered="false" size="small">
    <a-card-meta class="appearance-meta">
      <template #description>
        <span>
          Choose how the website looks to you. Select a single theme, or sync with
          your system and automatically switch between day and night themes.
        </span>
      </template>
    </a-card-meta>

    <a-row>
      <a-col :xs="24" :sm="16">
        <a-form-item>
          <a-radio-group v-model="color" class="color-mode-radio">
            <a-radio value="system"> ⚙️ System </a-radio>
            <a-radio disabled value="light"> 🌞 Light </a-radio>
            <a-radio disabled value="dark"> 🌛 Dark </a-radio>
          </a-radio-group>
        </a-form-item>
      </a-col>
    </a-row>
  </a-card>
</template>

<script>
export default {
  data() {
    return {
      color: 'system',
    }
  },
}
</script>

<style lang="less">
.color-mode-radio {
  .ant-radio-wrapper {
    display: block;
    height: 30px;
    line-height: 30px;
  }
}

.appearance-meta {
  margin-bottom: 8px;
}
</style>
