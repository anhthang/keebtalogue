<template>
  <div class="right-header">
    <a-dropdown v-if="user.email_verified">
      <a-avatar :src="user.picture" />

      <template #overlay>
        <a-menu>
          <a-menu-item v-if="authenticated">
            👋 <strong>{{ user.full_name }}</strong>
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
            <nuxt-link to="/login"><login-outlined /> Login </nuxt-link>
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
const login = async (provider) => {
  const { user: authUser, error } = await client.auth.signIn(
    { provider },
    { redirectTo: window.location.origin }
  );

  if (error) {
    message.warning(error.message);
  } else if (authUser) {
    userStore.setCurrentUser(authUser);
    userStore.getUserDocument(authUser.id);

    message.success(
      `Hello, ${authUser.app_metadata.full_name}. You successfully logged into this website.`
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
