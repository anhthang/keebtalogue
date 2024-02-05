<template>
  <a-flex vertical gap="large">
    <a-typography-title :level="2">Welcome back</a-typography-title>

    <a-flex vertical gap="small">
      <a-button block @click="login('google')">
        <a-flex gap="small" justify="center" align="center">
          <icon name="logos:google-icon" /> Continue with Google
        </a-flex>
      </a-button>
      <a-button block @click="login('discord')">
        <a-flex gap="small" justify="center" align="center">
          <icon name="logos:discord-icon" /> Continue with Discord
        </a-flex>
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
</template>

<script setup>
const client = useSupabaseClient()

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
</script>
