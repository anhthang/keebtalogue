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

<script>
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { message } from "ant-design-vue";

const auth = getAuth();
const provider = new GoogleAuthProvider();

const router = useRouter()

export default {
  data() {
    return {
      isMobile: false,
      user: {},
    };
  },
  methods: {
    loginWithGoogle() {
      signInWithPopup(auth, provider)
        .then(({ credential, user }) => {
          this.user = user;
          message.success(
            `Hello, ${user.displayName}. You successfully logged into this website.`
          );
        })
        .catch((err) => {
          message.warning(err.message);
        });
    },
    logout() {
      signOut(auth)
        .then(() => {
          message.success("You have been logged out successfully.");
          router.push("/");
        })
        .catch((err) => {
          message.error(err.message);
        });
    },
    gotoSettings() {
      router.push("/account/settings");
    },
  },
};
</script>
