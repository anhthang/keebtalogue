<template>
  <a-flex gap="small">
    <search-box v-if="!$device.isMobile" />

    <layout-appearance />

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
    <a-dropdown v-else-if="$device.isMobile">
      <a-button type="link" @click="toggleShowLogin">
        <login-outlined />
      </a-button>
    </a-dropdown>
    <a-dropdown v-else>
      <a-button type="link" @click="toggleShowLogin">
        <login-outlined /> Login
      </a-button>
    </a-dropdown>

    <a-modal v-model:open="showLoginModal" destroy-on-close :footer="null">
      <modal-login />
    </a-modal>
  </a-flex>
</template>

<script setup>
const router = useRouter()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const client = useSupabaseClient()

const showLoginModal = ref(false)
const toggleShowLogin = () => {
  showLoginModal.value = !showLoginModal.value
}

const logout = async () => {
  const { error } = await client.auth.signOut()
  if (error) {
    message.error(error.message)
  } else {
    userStore.$reset()
    message.success('You have been logged out successfully.')

    navigateTo('/')
  }
}

const gotoSettings = () => {
  router.push('/account/settings')
}
</script>

<style>
.social-login {
  margin-bottom: 2rem;
  margin-top: 3rem;
}

.custom-icon {
  margin-right: 0.5rem;
  vertical-align: 0.125rem;
}
</style>
