<template>
  <div class="right-header">
    <a-dropdown v-if="user.email_verified">
      <a-avatar :src="user.picture" />

      <template #overlay>
        <a-menu>
          <a-menu-item>
            👋 <strong>{{ user.name }}</strong>
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
      <nuxt-link to="/login">
        <a-button type="link"><login-outlined /> Login </a-button>
      </nuxt-link>
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
const { user } = storeToRefs(userStore);

const client = useSupabaseClient();

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
