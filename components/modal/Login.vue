<template>
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
