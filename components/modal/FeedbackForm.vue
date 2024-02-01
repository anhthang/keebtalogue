<template>
  <a-form :ref="formRef" :rules="formRules" :model="feedback" layout="vertical">
    <a-form-item
      ref="name"
      name="name"
      label="Name"
      v-bind="validateInfos.name"
    >
      <a-input v-model:value="feedback.name">
        <template #prefix><font-size-outlined /></template>
      </a-input>
    </a-form-item>

    <a-form-item
      ref="message"
      name="message"
      label="Message"
      v-bind="validateInfos.message"
    >
      <a-textarea
        :v-model="feedback.message"
        :auto-size="{ minRows: 5 }"
        placeholder="What can we do to make your experience even better?"
      />
    </a-form-item>

    <a-form-item>
      <a-typography-text strong>
        Help us make {{ $config.public.appName }} amazing!
      </a-typography-text>
    </a-form-item>

    <a-form-item ref="email" name="email" v-bind="validateInfos.email">
      <a-input
        v-model:value="feedback.email"
        placeholder="Leave your contact info here to get started."
      >
        <template #prefix><font-size-outlined /></template>
      </a-input>
    </a-form-item>
  </a-form>
</template>

<script setup>
import { Form } from 'ant-design-vue'

const feedback = ref({
  name: '',
  message: '',
})

const formRef = ref()
const formRules = ref({
  name: [{ required: true, type: 'string', trigger: ['change', 'blue'] }],
  message: [{ required: true, type: 'string', trigger: ['change', 'blue'] }],
  email: [{ type: 'string', trigger: ['change', 'blue'] }],
})

const { useForm } = Form
const { validate, validateInfos } = useForm(feedback, formRules)

const addFeedback = async () => {
  await validate()
    .then(async () => {
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
    })
    .catch(() => {
      // ignore
    })
}

defineExpose({
  addFeedback,
})
</script>
