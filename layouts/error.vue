<template>
  <Panel pt:root:class="!border-0 !bg-transparent">
    <div class="flex flex-col items-center">
      <div class="text-3xl font-medium mb-2">
        {{ error.statusCode }}
      </div>
      <div
        v-if="error.statusCode === 404"
        class="font-medium text-surface-500 dark:text-surface-300 mb-4"
      >
        Sorry, the page you visited does not exist.
      </div>
      <div
        v-else
        class="font-medium text-surface-500 dark:text-surface-300 mb-4"
      >
        Something went wrong.
      </div>

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
