<template>
  <div class="max-w-screen-2xl mx-auto my-0">
    <Message size="small" variant="simple" severity="secondary">
      © {{ new Date().getFullYear() }} {{ $config.public.appName }} -
      {{ $config.app.buildId }}
    </Message>
  </div>
</template>
