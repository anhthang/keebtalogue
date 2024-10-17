<template>
  <div class="flex items-center justify-between">
    <span> ©{{ new Date().getFullYear() }} {{ $config.public.appName }} </span>
    <NuxtLink :to="$config.public.donate" target="_blank" external>
      <Button text label="Buy Me a Coffee" icon="pi pi-coffee" />
    </NuxtLink>
  </div>
</template>

<style>
.global-footer {
  max-width: 1600px;
  margin: 0 auto;
}
</style>
