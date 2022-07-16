<template>
  <div class="right-header">
    <a-dropdown v-if="user.emailVerified">
      <div v-if="isMobile">
        <a-avatar :src="user.photoURL" />
      </div>
      <div v-else>
        <a-avatar :src="user.photoURL" />
        {{ user.displayName }}
      </div>
      <template #overlay>
        <a-menu>
          <a-menu-item>
            <span @click="gotoSettings"
              ><setting-outlined /> Settings
            </span>
          </a-menu-item>
          <a-menu-divider />
          <a-menu-item>
            <span @click="logout"><logout-outlined /> Logout </span>
          </a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>
    <a-dropdown v-else>
      <div>
        <a-avatar
          src="https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png"
        />
        Login
      </div>
      <template #overlay>
        <a-menu>
          <a-menu-item>
            <span @click="loginWithGoogle">
              <google-outlined /> Login with Google
            </span>
          </a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isMobile: false,
      user: {
        emailVerified: true,
        photoURL: "https://lh3.googleusercontent.com/a-/AOh14GgrOLp5igi5JC6Kx6_jc6sDfWChTDx4g_08IVHeWw=s96-c",
        displayName: "Bui Anh Thang"
      },
    };
  },
  methods: {
    async loginWithGoogle() {
      const google = new this.$fireModule.auth.GoogleAuthProvider();
      await this.$fireModule
        .auth()
        .signInWithPopup(google)
        .then(({ credential, user }) => {
          this.$message.success(
            `Hello, ${user.displayName}. You successfully logged into this website.`
          );
        })
        .catch((err) => {
          this.$message.warning(err.message);
        });
    },
    async logout() {
      await this.$fire.auth
        .signOut()
        .then(() => {
          this.$message.success("You have been logged out successfully.");
          this.$router.push("/");
        })
        .catch((err) => {
          this.$message.error(err.message);
        });
    },
    gotoSettings() {
      this.$router.push("/account/settings");
    },
  },
};
</script>
