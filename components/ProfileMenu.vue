<template>
  <div
    class="flex items-center gap-3 cursor-pointer"
    :class="{
      'justify-start px-3 py-2 hover:bg-slate-100 dark:hover:bg-zinc-700 rounded':
        $device.isDesktopOrTablet,
    }"
    @click="toggleProfileSettings"
  >
    <Avatar
      v-if="user.picture"
      :image="user.picture"
      size="large"
      shape="circle"
    />
    <Avatar v-else icon="pi pi-user" size="large" shape="circle" />
    <div v-if="!slim">
      <div class="text-xl font-medium">
        {{ user.name || 'Login' }}
      </div>
    </div>
  </div>
  <Menu
    id="overlay_menu"
    ref="profileSettings"
    :model="settingsMenu"
    :popup="true"
  />

  <Dialog
    v-model:visible="visible"
    modal
    class="w-[36rem]"
    :closable="false"
    dismissable-mask
  >
    <ModalLogin />
  </Dialog>
  <Toast />
</template>

<script setup>
const { slim } = defineProps({
  slim: Boolean,
})

const userStore = useUserStore()
const { authenticated, user } = storeToRefs(userStore)

const router = useRouter()
const client = useSupabaseClient()
const toast = useToast()

const profileSettings = ref()
const toggleProfileSettings = (event) => {
  profileSettings.value.toggle(event)
}

const colorMode = useColorMode()
const onChangeTheme = (mode) => {
  colorMode.preference = mode
}

const settingsMenu = computed(() => {
  const items = [
    {
      label: 'Appearance',
      items: [
        {
          label: 'System',
          icon: 'pi pi-desktop',
          command: () => onChangeTheme('system'),
          class: colorMode.preference === 'system' && activePopMenu,
        },
        {
          label: 'Light',
          icon: 'pi pi-sun',
          command: () => onChangeTheme('light'),
          class: colorMode.preference === 'light' && activePopMenu,
        },
        {
          label: 'Dark',
          icon: 'pi pi-moon',
          command: () => onChangeTheme('dark'),
          class: colorMode.preference === 'dark' && activePopMenu,
        },
      ],
    },
  ]

  if (authenticated.value) {
    items.unshift(
      {
        label: user.value.name,
        items: [
          {
            label: user.value.email,
            disabled: true,
          },
        ],
      },
      {
        separator: true,
      },
    )

    items.push(
      {
        separator: true,
      },
      {
        label: 'Profile',
        items: [
          {
            label: 'Settings',
            icon: 'pi pi-cog',
            command: () => {
              router.push('/account/settings')
            },
          },
        ],
      },
      {
        separator: true,
      },
      {
        label: 'Logout',
        icon: 'pi pi-sign-out',
        command: () => {
          logout()
        },
      },
    )
  } else {
    items.unshift(
      {
        label: 'Welcome',
        items: [
          {
            label: 'Login',
            icon: 'pi pi-sign-in',
            command: () => {
              toggleShowLogin()
            },
          },
        ],
      },
      {
        separator: true,
      },
    )
  }

  return items
})

const visible = ref(false)
const toggleShowLogin = () => {
  visible.value = !visible.value
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
</script>
