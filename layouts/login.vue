<template>
  <a-layout>
    <a-layout-content>
      <NuxtPage />
    </a-layout-content>
    <a-layout-footer>
      <layout-footer />
    </a-layout-footer>
  </a-layout>
</template>

<script>
import LayoutFooter from '~/components/layouts/Footer.vue'

export default {
  components: { LayoutFooter },
}
</script>
