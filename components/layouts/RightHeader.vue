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
      <a-avatar
        src="https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png"
      />

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
import { message } from "ant-design-vue";
import { storeToRefs } from "pinia";
import { useUserStore } from "~~/stores/user";

const router = useRouter();

const isMobile = false;

const userStore = useUserStore();
const { authenticated, user } = storeToRefs(userStore);

const client = useSupabaseClient();
const loginWithGoogle = async () => {
  const { user: authUser, error } = await client.auth.signIn({
    provider: "google",
  });
  if (error) {
    message.warning(error.message);
  } else if (authUser) {
    userStore.setCurrentUser(authUser);
    userStore.getUserDocument(authUser.id);

    message.success(
      `Hello, ${user.displayName}. You successfully logged into this website.`
    );
  }
};

const logout = async () => {
  const { error } = await client.auth.signOut();
  if (error) {
    message.error(error.message);
  } else {
    userStore.$reset();
    message.success("You have been logged out successfully.");

    navigateTo("/");
  }
};

const gotoSettings = () => {
  router.push("/account/settings");
};
</script>
