<template>
  <div class="container login-container">
    <h1>{{ config.public.appName }}</h1>
    <a-button type="primary" @click="loginWithGoogle">
      <google-outlined /> Login with Google
    </a-button>
  </div>
</template>

<script setup>
definePageMeta({
  layout: "login",
});

useHead({
  title: "Login",
});

import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { message } from "ant-design-vue";

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

// export default {
//   middleware({ store, redirect }) {
//     // If the user is not authenticated
//     if (store.state.user.emailVerified) {
//       return redirect("/");
//     }
//   },
// };
</script>

<style lang="less">
.login-container {
  background-image: url(https://gw.alipayobjects.com/zos/rmsportal/TVYTbAXWheQpRcWDaDMu.svg);
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 100%;
  align-items: center;
  justify-content: center;

  button {
    margin-bottom: 8px;
  }
}
</style>
