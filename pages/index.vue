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
      <a-calendar @panelChange="onPanelChange" />
    </a-page-header>
  </div>
</template>

<script>
export default {
  methods: {
    onPanelChange(value, mode) {
      // console.log(value, mode)
    },
  },
}
</script>
