<template>
  <div class="container login-container">
    <img src="/icon.png" alt="logo" class="logo-icon" />
    <h1>{{ config.public.appName }}</h1>
    <a-button type="primary" @click="loginWithGoogle">
      <google-outlined /> Login with Google
    </a-button>
  </div>
</template>

<script setup>
import { message } from "ant-design-vue";

definePageMeta({
  layout: "login",
  middleware: "auth",
});

useHead({
  title: "Login",
});

const router = useRouter();

const client = useSupabaseClient();
const loginWithGoogle = async () => {
  const { user, error } = await client.auth.signIn({ provider: "google" });
  if (error) {
    message.warning(err.message);
  } else {
    message.success(
      `Hello, ${user.full_name}. You successfully logged into this website.`
    );

    router.back();
  }
};

const config = useRuntimeConfig();
</script>

<style lang="postcss" scoped>
.login-container {
  @apply bg-[url('https://gw.alipayobjects.com/zos/rmsportal/TVYTbAXWheQpRcWDaDMu.svg')] bg-no-repeat bg-center bg-auto items-center justify-center;
}

.login-container button {
  @apply mb-2;
}

.logo-icon {
  @apply w-32;
}
</style>
