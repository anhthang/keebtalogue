<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
import { initializeApp } from "@firebase/app";
import { useUserStore } from "./stores/user";

const config = useRuntimeConfig();
initializeApp(config.public.firebase);

const userStore = useUserStore();

const client = useSupabaseClient();
client.auth.onAuthStateChange((event, session) => {
  switch (event) {
    case "SIGNED_IN":
      userStore.setCurrentUser(session.user);
      break;
    case "SIGNED_OUT":
      userStore.$reset();
      break
    case "TOKEN_REFRESHED":
    case "USER_UPDATED":
    case "USER_DELETED":
    case "PASSWORD_RECOVERY":
    default:
      break;
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