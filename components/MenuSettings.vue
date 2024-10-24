<template>
  <Button
    severity="secondary"
    aria-haspopup="true"
    aria-controls="overlay_menu"
    fluid
    outlined
    @click="toggleProfileSeetings"
  >
    <Avatar
      v-if="user.picture"
      :image="user.picture"
      size="large"
      shape="circle"
    />
    <Avatar v-else icon="pi pi-user" size="large" shape="circle" />
    <div>
      <div
        :class="slim ? 'hidden' : 'text-base font-medium text-color leading-5'"
      >
        {{ user.name }}
      </div>
      <div :class="slim ? 'hidden' : 'text-sm text-muted-color mt-1'">
        {{ user.email }}
      </div>
    </div>
  </Button>
  <Menu
    id="overlay_menu"
    ref="profileSettings"
    :model="settingsMenu"
    :popup="true"
  />

  <Dialog
    v-model:visible="visible"
    modal
    class="w-[35rem]"
    :closable="false"
    dismissable-mask
  >
    <modal-login />
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
const toggleProfileSeetings = (event) => {
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
        },
        {
          label: 'Light',
          icon: 'pi pi-sun',
          command: () => onChangeTheme('light'),
        },
        {
          label: 'Dark',
          icon: 'pi pi-moon',
          command: () => onChangeTheme('dark'),
        },
      ],
    },
  ]

  if (authenticated.value) {
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
