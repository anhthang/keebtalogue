<template>
  <a-flex gap="small">
    <a-button v-if="!$device.isMobile" type="text" @click="toggleShowFeedback">
      <a-tooltip title="Feedback"><message-outlined /></a-tooltip>
    </a-button>

    <a-dropdown v-if="user.email_verified">
      <a-avatar :src="user.picture" style="cursor: pointer" />

      <template #overlay>
        <a-menu :selected-keys="[$colorMode.preference]" @click="onChangeMenu">
          <a-menu-item>
            👋 <strong>{{ user.name }}</strong>
          </a-menu-item>
          <a-menu-divider />

          <layout-appearance />
          <a-menu-divider />

          <a-menu-item key="/account/settings">
            <template #icon><setting-outlined /></template> Settings
          </a-menu-item>
          <a-menu-item v-if="$device.isMobile" key="feedback">
            <template #icon><message-outlined /></template> Feedback
          </a-menu-item>
          <a-menu-divider />

          <a-menu-item key="logout">
            <template #icon><logout-outlined /></template> Logout
          </a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>
    <a-dropdown v-else>
      <a-avatar>
        <template #icon><user-outlined /> </template>
      </a-avatar>

      <template #overlay>
        <a-menu :selected-keys="[$colorMode.preference]" @click="onChangeMenu">
          <a-menu-item key="login">
            <template #icon><login-outlined /></template> Login
          </a-menu-item>
          <a-menu-divider />

          <layout-appearance />
        </a-menu>
      </template>
      <a-button type="link" @click="toggleShowLogin">
        <login-outlined /> Login
      </a-button>
    </a-dropdown>

    <Dialog
      v-model:visible="visible.login"
      modal
      class="w-[35rem]"
      :closable="false"
      dismissable-mask
    >
      <modal-login />
    </Dialog>

    <Dialog
      v-model:visible="visible.feedback"
      modal
      header="Share your thoughts!"
      dismissable-mask
      class="w-[35rem]"
    >
      <modal-feedback-form />
    </Dialog>

    <Toast />
  </a-flex>
</template>

<script setup>
const router = useRouter()
const colorMode = useColorMode()
const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const client = useSupabaseClient()
const toast = useToast()

const visible = ref({
  feedback: false,
  login: false,
})

const toggleShowFeedback = () => {
  visible.value.feedback = !visible.value.feedback
}

const toggleShowLogin = () => {
  visible.value.login = !visible.value.login
}

const logout = async () => {
  const { error } = await client.auth.signOut()
  if (error) {
    toast.add({ severity: 'error', summary: error.message, life: 3000 })
  } else {
    userStore.$reset()
    toast.add({
      severity: 'success',
      summary: 'You have been logged out successfully.',
      life: 3000,
    })

    navigateTo('/')
  }
}

const onChangeMenu = (e) => {
  if (!e.key) {
    // nothing
  } else if (e.key.startsWith('/')) {
    router.push(e.key)
  } else if (e.key === 'feedback') {
    toggleShowFeedback()
  } else if (e.key === 'login') {
    toggleShowLogin()
  } else if (e.key === 'logout') {
    logout()
  } else {
    colorMode.preference = e.key
  }
}
</script>
