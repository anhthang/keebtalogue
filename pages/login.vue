<template>
  <div class="container login-container">
    <h1>Keeb Catalogue</h1>
    <a-button icon="google" type="primary" @click="loginWithGoogle">
      Login with Google
    </a-button>
  </div>
</template>

<script>
definePageMeta({
  layout: "login",
});

export default {
  middleware({ store, redirect }) {
    // If the user is not authenticated
    if (store.state.user.emailVerified) {
      return redirect("/");
    }
  },
  methods: {
    async loginWithGoogle() {
      const google = new this.$fireModule.auth.GoogleAuthProvider();
      await this.$fireModule
        .auth()
        .signInWithPopup(google)
        .then(({ user }) => {
          this.$message.success(
            `Hello, ${user.displayName}. You successfully logged into this website.`
          );

          this.$router.back();
        })
        .catch((err) => {
          this.$message.warning(err.message);
        });
    },
  },
};
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
