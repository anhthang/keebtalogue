<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
import { initializeApp } from "@firebase/app";

const config = useRuntimeConfig();
initializeApp(config.public.firebase);

useHead({
  titleTemplate: (chunk) => {
    return chunk
      ? `${chunk} - ${config.public.appName}`
      : config.public.appName;
  },
});
</script>