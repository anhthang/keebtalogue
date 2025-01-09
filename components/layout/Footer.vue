<template>
  <div class="max-w-screen-2xl mx-auto my-0">
    <Message size="small" variant="simple" severity="secondary">
      ©{{ new Date().getFullYear() }} {{ appName }} - v{{ version }} build
      {{ revision }}
    </Message>
  </div>
</template>

<script setup>
const {
  public: { appName, version, revision },
} = useRuntimeConfig()
</script>
