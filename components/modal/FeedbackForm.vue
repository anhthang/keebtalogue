<template>
  <div class="flex flex-col gap-6">
    <div class="flex flex-col gap-2">
      <label for="feedback_name">Name</label>
      <InputText id="feedback_name" v-model.trim="feedback.name" type="text" />
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
      <span>
        Please don't include any sensitive information like passwords, or
        personal details.
      </span>
    </div>

    <Divider align="center">
      <b>Help us make {{ $config.public.appName }} amazing!</b>
    </Divider>

    <div class="flex flex-col gap-2">
      <label for="feedback_email">Email</label>
      <InputText
        id="feedback_email"
        v-model.trim="feedback.email"
        placeholder="Leave your contact info here to get started."
        type="text"
      />
    </div>

    <div class="flex flex-col gap-2">
      <Button label="Send Feedback" @click="addFeedback" />
    </div>
  </div>
</template>

<script setup>
const feedback = ref({
  name: '',
  message: '',
})

// const formRules = ref({
//   name: [{ required: true, type: 'string', trigger: ['change', 'blue'] }],
//   message: [{ required: true, type: 'string', trigger: ['change', 'blue'] }],
//   email: [{ type: 'string', trigger: ['change', 'blue'] }],
// })

const addFeedback = async () => {
  await $fetch('/api/feedbacks', {
    method: 'post',
    body: feedback.value,
  })
    .then(() => {
      // message.success(
      //   'Your feedback is valuable to us. We appreciate you taking the time to share it!',
      // )
      notification.success({
        message: 'Feedback submitted!',
        description:
          'Your feedback is valuable to us. We appreciate you taking the time to share it!',
      })
    })
    .catch((error) => {
      message.error(error.message)
    })
}
</script>
