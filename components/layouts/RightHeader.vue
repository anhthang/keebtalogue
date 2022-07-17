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
            <span @click="gotoSettings"><setting-outlined /> Settings </span>
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

<script setup>
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { message } from "ant-design-vue";

const router = useRouter();

const isMobile = false;

const auth = getAuth();
const provider = new GoogleAuthProvider();

import { useUserStore } from "~~/stores/user";
import { storeToRefs } from "pinia";

const userStore = useUserStore();
const { user } = storeToRefs(userStore);

const loginWithGoogle = async () => {
  await signInWithPopup(auth, provider)
    .then(({ credential, user }) => {
      userStore.$patch({ user });

      userStore.getUserDocument(user.uid);

      message.success(
        `Hello, ${user.displayName}. You successfully logged into this website.`
      );
    })
    .catch((err) => {
      message.warning(err.message);
    });
};

const logout = async () => {
  await signOut(auth)
    .then(() => {
      userStore.$patch({ user: {} });

      message.success("You have been logged out successfully.");
      this.$router.push("/");
    })
    .catch((err) => {
      message.error(err.message);
    });
};

const gotoSettings = () => {
  router.push("/account/settings");
};
</script>
