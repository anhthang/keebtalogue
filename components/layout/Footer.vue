<template>
  <a-flex justify="space-between">
    <span> ©{{ new Date().getFullYear() }} {{ $config.public.appName }} </span>
    <NuxtLink
      to="https://www.buymeacoffee.com/anhthang"
      target="_blank"
      external
    >
      <coffee-outlined /> Buy Me a Coffee
    </NuxtLink>
  </a-flex>
</template>
