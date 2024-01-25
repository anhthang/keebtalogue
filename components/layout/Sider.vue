<template>
  <a-flex vertical justify="space-between">
    <a-menu
      :selected-keys="selectedKeys"
      style="height: 100%"
      @click="onChangeMenu"
    >
      <a-menu-item key="/">
        <template #icon>
          <img src="/icon.png" alt="logo" class="menu-icon" width="40px" />
        </template>
        <span>Home</span>
      </a-menu-item>
      <a-menu-divider />

      <a-menu-item key="/artisan/maker">
        <usergroup-add-outlined /> <span>Makers</span>
      </a-menu-item>
      <a-menu-item key="/artisan/collection">
        <book-outlined /> <span>Collections</span>
      </a-menu-item>
      <a-menu-item key="/artisan/marketplace">
        <shop-outlined /> <span>Marketplace</span>
      </a-menu-item>
      <a-menu-divider />

      <a-menu-item key="/keycap/interest-check">
        <schedule-outlined /> <span>Interest Check</span>
      </a-menu-item>
      <a-sub-menu key="keycap" title="Keycap">
        <template #icon><appstore-outlined /></template>
        <a-sub-menu
          v-for="[profile, manufacturers] of Object.entries(keycapProfiles)"
          :key="profile"
          :title="profile"
        >
          <a-menu-item
            v-for="[key, value] of Object.entries(manufacturers)"
            :key="`/keycap/${key}`"
          >
            {{ value }}
          </a-menu-item>
        </a-sub-menu>
      </a-sub-menu>
      <a-menu-divider />

      <a-menu-item key="/about">
        <info-circle-outlined /> <span>About</span>
      </a-menu-item>
    </a-menu>

    <a-menu :selected-keys="[$colorMode.value]" @click="onChangeMenu">
      <a-sub-menu key="profile" title="Profile">
        <template #icon><user-outlined /> </template>
        <a-menu-item v-if="authenticated" key="/account/settings">
          <setting-outlined /> Account Preferences
        </a-menu-item>
        <a-menu-divider />

        <a-menu-item v-if="authenticated" key="logout">
          <logout-outlined /> Logout
        </a-menu-item>
        <a-menu-item v-else key="login"> <login-outlined /> Login </a-menu-item>
        <a-menu-divider />
        <a-menu-item-group title="Theme" />
        <a-menu-item key="system"> System </a-menu-item>
        <a-menu-item key="light"> Light </a-menu-item>
        <a-menu-item key="dark"> Dark </a-menu-item>
      </a-sub-menu>
    </a-menu>

    <a-modal v-model:open="showLoginModal" destroy-on-close :footer="null">
      <a-flex vertical gap="large">
        <a-typography-title :level="2">Welcome back</a-typography-title>

        <a-flex vertical gap="small">
          <a-button block @click="login('google')">
            <span class="custom-icon">
              <icon name="logos:google-icon" />
            </span>
            Continue with Google
          </a-button>
          <a-button block @click="login('discord')">
            <span class="custom-icon">
              <icon name="logos:discord-icon" />
            </span>
            Continue with Discord
          </a-button>
        </a-flex>

        <a-flex justify="center">
          <a-typography-text>
            By clicking continue, you agree to our
            <a-typography-link href="/policy" target="_blank">
              Privacy Policy
            </a-typography-link>
            and Terms of Service.
          </a-typography-text>
        </a-flex>
      </a-flex>
    </a-modal>
  </a-flex>
</template>

<script setup>
const route = useRoute()
const router = useRouter()
const colorMode = useColorMode()
const userStore = useUserStore()
const { authenticated } = storeToRefs(userStore)

const client = useSupabaseClient()

const selectedKeys = computed(() => {
  const second = route.path.indexOf('/', 1)
  if (second === -1) {
    return [route.path]
  }

  const third = route.path.indexOf('/', second + 1)

  return third === -1 ? [route.path] : [route.path.substring(0, third)]
}, [route.path])

const showLoginModal = ref(false)
const toggleShowLogin = () => {
  showLoginModal.value = !showLoginModal.value
}

const onChangeMenu = (e) => {
  if (e.key.startsWith('/')) {
    router.push(e.key)
  } else if (e.key === 'login') {
    toggleShowLogin()
  } else if (e.key === 'logout') {
    logout()
  } else {
    colorMode.preference = e.key
  }
}

const login = async (provider) => {
  const { user, error } = await client.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: window.location.origin,
    },
  })

  if (error) {
    message.warning(err.message)
  } else if (user) {
    message.success(
      `Hello, ${user.name}. You successfully logged into this website.`,
    )

    router.back()
  }
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
</script>

<style>
.menu-icon {
  position: relative;
  left: -12px;
}

.social-login {
  margin-bottom: 2rem;
  margin-top: 3rem;
}

.custom-icon {
  margin-right: 0.5rem;
  vertical-align: 0.125rem;
}
</style>
