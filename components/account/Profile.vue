<template>
  <div class="grid grid-cols-4 gap-4">
    <div class="col-span-2 md:col-span-2">
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-2">
          <label for="profile_name">Name</label>
          <IconField>
            <InputIcon class="pi pi-user" />
            <InputText
              id="profile_name"
              v-model.trim="user.name"
              disabled
              fluid
            />
          </IconField>
        </div>
        <div class="flex flex-col gap-2">
          <label for="profile_email">Email</label>
          <IconField>
            <InputIcon class="pi pi-inbox" />
            <InputText
              id="profile_email"
              v-model.trim="user.email"
              disabled
              fluid
            />
            <InputIcon v-if="user.email_verified" class="pi pi-verified" />
          </IconField>
        </div>
        <div class="flex flex-col gap-2">
          <label for="social_reddit">Reddit</label>
          <IconField>
            <InputIcon class="pi pi-reddit" />
            <InputText
              id="social_reddit"
              v-model.trim="social.reddit"
              placeholder="u/username"
              fluid
            />
          </IconField>
        </div>
        <div class="flex flex-col gap-2">
          <label for="social_discord">Discord</label>
          <IconField>
            <InputIcon class="pi pi-discord" />
            <InputText
              id="social_discord"
              v-model.trim="social.discord"
              placeholder="username#0000"
              :disabled="discordVerified"
              fluid
            />
            <InputIcon v-if="discordVerified" class="pi pi-verified" />
          </IconField>
        </div>
        <div class="flex flex-col gap-2">
          <label for="social_qq">QQ</label>
          <IconField>
            <InputIcon class="pi pi-comment" />
            <InputText
              id="social_qq"
              v-model.trim="social.qq"
              placeholder="00000000"
              fluid
            />
          </IconField>
        </div>
        <div class="flex flex-col gap-2">
          <Button
            label="Save"
            icon="pi pi-save"
            @click="saveSettings('social')"
          />
        </div>
      </div>
    </div>

    <Toast />
  </div>
</template>

<script setup>
const userStore = useUserStore()
const { user, social } = storeToRefs(userStore)

const toast = useToast()

const loading = ref(false)
const saveSettings = () => {
  loading.value = true
  $fetch(`/api/users/${user.value.uid}`, {
    method: 'post',
    body: social.value,
  })
    .then(() => {
      toast.add({
        severity: 'success',
        summary: 'Your profile has been updated.',
        life: 3000,
      })
      loading.value = false
    })
    .catch((error) => {
      toast.add({ severity: 'error', summary: error.message, life: 3000 })
      loading.value = false
    })
}

const discordVerified = computed(() => {
  return user.value && user.value.providers?.includes('discord')
})
</script>
