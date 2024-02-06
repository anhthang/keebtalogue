<template>
  <a-flex gap="small">
    <a-button v-if="!$device.isMobile" type="text" @click="toggleShowFeedback">
      <a-tooltip title="Feedback"><message-outlined /></a-tooltip>
    </a-button>

    <a-dropdown v-if="user.email_verified">
      <a-avatar :src="user.picture" />

      <template #overlay>
        <a-menu :selected-keys="[$colorMode.preference]" @click="onChangeMenu">
          <a-menu-item>
            👋 <strong>{{ user.name }}</strong>
          </a-menu-item>
          <a-menu-divider />

          <a-menu-item key="/account/settings">
            <template #icon><setting-outlined /></template> Settings
          </a-menu-item>
          <a-sub-menu title="Appearance">
            <template #icon>
              <icon name="pajamas:appearance" />
            </template>
            <a-menu-item key="system"> System </a-menu-item>
            <a-menu-item key="light"> Light </a-menu-item>
            <a-menu-item key="dark"> Dark </a-menu-item>
          </a-sub-menu>
          <a-menu-divider />

          <a-menu-item v-if="$device.isMobile" key="feedback">
            <template #icon><message-outlined /></template> Feedback
          </a-menu-item>
          <a-menu-divider v-if="$device.isMobile" />

          <a-menu-item key="logout">
            <template #icon><logout-outlined /></template> Logout
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

    <a-modal
      v-model:open="showFeedback"
      title="Share your thoughts!"
      destroy-on-close
      ok-text="Send Feedback"
      :confirm-loading="confirmLoading"
      @ok="addFeedback"
    >
      <modal-feedback-form ref="feedbackForm" />
    </a-modal>
  </a-flex>
</template>

<script setup>
const router = useRouter()
const colorMode = useColorMode()
const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const client = useSupabaseClient()

const showFeedback = ref(false)
const toggleShowFeedback = () => {
  showFeedback.value = !showFeedback.value
}

const feedbackForm = ref()
const confirmLoading = ref(false)
const addFeedback = async () => {
  confirmLoading.value = true

  await feedbackForm.value
    .addFeedback()
    .then(() => {
      confirmLoading.value = false
    })
    .catch(() => {
      confirmLoading.value = false
    })
}

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
