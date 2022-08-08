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
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { message } from "ant-design-vue";

definePageMeta({
  layout: "login",
});

useHead({
  title: "Login",
});

const auth = getAuth();
const provider = new GoogleAuthProvider();

const router = useRouter();

const loginWithGoogle = () => {
  signInWithPopup(auth, provider)
    .then(({ user }) => {
      message.success(
        `Hello, ${user.displayName}. You successfully logged into this website.`
      );

      router.back();
    })
    .catch((err) => {
      message.warning(err.message);
    });
};

const config = useRuntimeConfig();
</script>

<style lang="postcss" scoped>
.login-container {
  @apply bg-[url('https://gw.alipayobjects.com/zos/rmsportal/TVYTbAXWheQpRcWDaDMu.svg')] bg-no-repeat bg-center bg-auto items-center justify-center
}

.login-container button {
  @apply mb-2
}

.logo-icon {
  @apply w-32
}
</style>
