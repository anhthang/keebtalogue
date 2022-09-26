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
      <a-button type="link" @click="toggleShowLogin">
        <login-outlined /> Login
      </a-button>
    </a-dropdown>

    <a-modal v-model:visible="showLoginModal" destroy-on-close :footer="null">
      <a-typography-title :level="2">Welcome back</a-typography-title>

      <a-row :gutter="[8, 8]" class="social-login">
        <a-button @click="login('google')">
          <span class="custom-icon">
            <icon name="logos:google-icon" />
          </span>
          Continue with Google
        </a-button>
        <a-button @click="login('discord')">
          <span class="custom-icon">
            <icon name="logos:discord-icon" />
          </span>
          Continue with Discord
        </a-button>
      </a-row>

      <a-typography-text>
        By clicking continue, you agree to our
        <a-typography-link href="/policy" target="_blank">
          Privacy Policy
        </a-typography-link>
        and Terms of Service.
      </a-typography-text>
    </a-modal>
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

const showLoginModal = ref(false);
const toggleShowLogin = () => {
  showLoginModal.value = !showLoginModal.value;
};

const login = async (provider) => {
  const { user, error } = await client.auth.signIn(
    { provider },
    { redirectTo: window.location.origin }
  );

  if (error) {
    message.warning(err.message);
  } else if (user) {
    message.success(
      `Hello, ${user.name}. You successfully logged into this website.`
    );

    router.back();
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

<style lang="postcss" scoped>
.social-login {
  @apply flex flex-col mt-12 mb-8;
}

.custom-icon {
  @apply mr-2 align-[0.125rem];
}
</style>
