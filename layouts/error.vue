<template>
  <Panel pt:root:class="!border-0 !bg-transparent">
    <div
      v-if="error.statusCode === 404"
      class="flex flex-col items-center gap-8"
    >
      <NuxtImg class="w-1/3" src="/svg/404.svg" alt="Not Found" />

      <div class="text-2xl">Sorry, the page you visited does not exist.</div>

      <nuxt-link to="/">
        <Button label="Back Home" icon="pi pi-home" />
      </nuxt-link>
    </div>
    <div class="flex flex-col items-center gap-8">
      <NuxtImg class="w-1/3" src="/svg/500.svg" alt="Internal Server Error" />

      <div class="text-2xl">Uh oh. Something went wrong.</div>

      <nuxt-link to="/">
        <Button label="Back Home" icon="pi pi-home" />
      </nuxt-link>
    </div>
  </Panel>
</template>

<script>
export default {
  // eslint-disable-next-line vue/require-prop-types
  props: ['error'],
}
</script>
