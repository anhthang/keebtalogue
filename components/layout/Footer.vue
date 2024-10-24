<template>
  <div class="flex items-center justify-between max-w-screen-2xl mx-auto my-0">
    <span> ©{{ new Date().getFullYear() }} {{ $config.public.appName }} </span>
    <NuxtLink :to="$config.public.donate" target="_blank" external>
      <Button text label="Buy Me a Coffee" icon="pi pi-coffee" />
    </NuxtLink>
  </div>
</template>
