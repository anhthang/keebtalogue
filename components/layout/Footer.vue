<template>
  <div class="global-footer">
    <a-flex justify="space-between">
      <span>
        ©{{ new Date().getFullYear() }} {{ $config.public.appName }}
      </span>
      <NuxtLink :to="$config.public.donate" target="_blank" external>
        <coffee-outlined /> Buy Me a Coffee
      </NuxtLink>
    </a-flex>
  </div>
</template>

<style>
.global-footer {
  max-width: 1600px;
  margin: 0 auto;
}
</style>
