<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
import { initializeApp } from "@firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useUserStore } from "./stores/user";

const config = useRuntimeConfig();
initializeApp(config.public.firebase);

const userStore = useUserStore();

const auth = getAuth();
onAuthStateChanged(auth, (user) => {
  if (user) {
    userStore.setCurrentUser(user);
  } else {
    // User is signed out or not logged in
  }
});

useHead({
  titleTemplate: (chunk) => {
    return chunk
      ? `${chunk} - ${config.public.appName}`
      : config.public.appName;
  },
});
</script>