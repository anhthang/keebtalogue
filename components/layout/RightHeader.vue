<template>
  <a-flex gap="small">
    <a-button v-if="!$device.isMobile" type="text" @click="toggleShowFeedback">
      <a-tooltip title="Feedback"><message-outlined /></a-tooltip>
    </a-button>

    <a-dropdown>
      <a-avatar :src="user.picture" style="cursor: pointer" />

      <template #overlay>
        <Menu :model="menu" pt:end:class="ml-4">
          <template v-if="authenticated" #end>
            <div class="flex items-center">
              <Avatar :image="user.picture" shape="circle" size="large" />
              <Card class="!shadow-none">
                <template #title>{{ user.name }}</template>
                <template #subtitle>{{ user.email }}</template>
              </Card>
            </div>
          </template>
        </Menu>
      </template>
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
const userStore = useUserStore()
const { authenticated, user } = storeToRefs(userStore)

const client = useSupabaseClient()
const toast = useToast()

const menu = computed(() => {
  const items = [
    {
      label: 'Appearance',
      items: [
        {
          label: 'System',
          icon: 'pi pi-desktop',
        },
        {
          label: 'Light',
          icon: 'pi pi-sun',
        },
        {
          label: 'Dark',
          icon: 'pi pi-moon',
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
          {
            label: 'Logout',
            icon: 'pi pi-sign-out',
            command: () => {
              logout()
            },
          },
        ],
      },
      {
        separator: true,
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
</script>
