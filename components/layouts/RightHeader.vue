<template>
  <div class="right-header">
    <a-dropdown v-if="user.emailVerified">
      <a-avatar :src="user.photoURL" />

      <template #overlay>
        <a-menu>
          <a-menu-item v-if="authenticated">
            👋 <strong>{{ user.displayName }}</strong>
          </a-menu-item>
          <a-menu-divider />
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
const { authenticated, user } = storeToRefs(userStore);

const loginWithGoogle = async () => {
  await signInWithPopup(auth, provider)
    .then(({ credential, user }) => {
      userStore.setCurrentUser(user);
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
      userStore.$reset();

      // FIXME: this my cause issue with other websites/tabs using firebase auth login
      indexedDB.deleteDatabase("firebaseLocalStorageDb");

      message.success("You have been logged out successfully.");

      navigateTo("/");
    })
    .catch((err) => {
      message.error(err.message);
    });
};

const gotoSettings = () => {
  router.push("/account/settings");
};
</script>
