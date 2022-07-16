<template>
  <div>
    <NuxtLayout>
      <NuxtPage/>
    </NuxtLayout>
  </div>
</template>

<script setup>
import { initializeApp } from "@firebase/app";

const config = useRuntimeConfig()
initializeApp(config.public.firebase)
</script>