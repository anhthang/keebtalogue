<template>
  <div class="flex flex-col gap-6">
    <div class="flex flex-col gap-2">
      <label for="feedback_name">Name</label>
      <IconField>
        <InputIcon class="pi pi-user" />
        <InputText
          id="feedback_name"
          v-model.trim="feedback.name"
          type="text"
          fluid
        />
      </IconField>
    </div>
    <div class="flex flex-col gap-2">
      <label for="feedback_message">Message</label>
      <Textarea
        id="feedback_message"
        v-model.trim="feedback.message"
        placeholder="What can we do to make your experience even better?"
        :rows="5"
        auto-resize
      />
      <span class="text-sm text-yellow-600 dark:text-yellow-500">
        Please don't include any sensitive information like passwords, or
        personal details.
      </span>
    </div>

    <Divider align="center" pt:content:class="text-xl">
      <b>Help us make {{ $config.public.appName }} amazing!</b>
    </Divider>

    <div class="flex flex-col gap-2">
      <label for="feedback_email">Email</label>
      <IconField>
        <InputIcon class="pi pi-inbox" />
        <InputText
          id="feedback_email"
          v-model.trim="feedback.email"
          placeholder="Leave your contact info here to get started."
          type="text"
          fluid
        />
      </IconField>
    </div>

    <div class="flex flex-col gap-2">
      <Button label="Send Feedback" @click="onSubmit" />
    </div>

    <Toast />
  </div>
</template>

<script setup>
const emit = defineEmits(['onSuccess'])

const toast = useToast()

const feedback = ref({
  name: '',
  message: '',
})

// const formRules = ref({
//   name: [{ required: true, type: 'string', trigger: ['change', 'blue'] }],
//   message: [{ required: true, type: 'string', trigger: ['change', 'blue'] }],
//   email: [{ type: 'string', trigger: ['change', 'blue'] }],
// })

const onSubmit = async () => {
  await $fetch('/api/feedbacks', {
    method: 'post',
    body: feedback.value,
  })
    .then(() => {
      toast.add({
        severity: 'success',
        summary: 'Feedback submitted!',
        detail:
          'Your feedback is valuable to us. We appreciate you taking the time to share it!',
        life: 3000,
      })
      emit('onSuccess')
    })
    .catch((error) => {
      toast.add({ severity: 'error', summary: error.message, life: 3000 })
    })
}
</script>
