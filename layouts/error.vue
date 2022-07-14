<template>
  <div class="container">
    <a-result
      v-if="error.statusCode === 404"
      status="404"
      title="404"
      sub-title="Sorry, the page you visited does not exist."
    >
      <template #extra>
        <nuxt-link to="/">
          <a-button type="primary"> Back Home </a-button>
        </nuxt-link>
      </template>
    </a-result>
    <a-result
      v-else
      status="500"
      title="500"
      sub-title="Sorry, the server is wrong."
    >
      <template #extra>
        <nuxt-link to="/">
          <a-button type="primary"> Back Home </a-button>
        </nuxt-link>
      </template>
    </a-result>
  </div>
</template>

<script>
export default {
  // eslint-disable-next-line vue/require-prop-types
  props: ['error'],
}
</script>
