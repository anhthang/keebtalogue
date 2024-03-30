<template>
  <a-flex vertical gap="large">
    <a-typography-title
      :level="2"
      style="
        background-image: linear-gradient(
          74deg,
          var(--color-text-gradient-stop-1) 0,
          var(--color-text-gradient-stop-2) 9%,
          var(--color-text-gradient-stop-3) 20%,
          var(--color-text-gradient-stop-3) 24%,
          var(--color-text-gradient-stop-2) 35%,
          var(--color-text-gradient-stop-1) 44%,
          var(--color-text-gradient-stop-2) 50%,
          var(--color-text-gradient-stop-3) 56%,
          var(--color-surface) 75%,
          var(--color-surface) 100%
        );
        background-size: 100%;
        color: transparent;
        background-clip: text;
      "
    >
      Welcome back
    </a-typography-title>

    <a-flex vertical gap="small">
      <a-button size="large" block @click="login('google')">
        <a-flex gap="small" justify="center" align="center">
          <google-square-filled style="color: #ea4335; font-size: 20px" />
          Continue with Google
        </a-flex>
      </a-button>
      <a-button size="large" block @click="login('discord')">
        <a-flex gap="small" justify="center" align="center">
          <discord-filled style="color: #5865f2; font-size: 20px" />
          Continue with Discord
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
