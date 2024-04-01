<template>
  <ContentDoc>
    <template #default="{ doc }">
      <a-page-header :title="doc.title" class="container">
        <ContentRenderer :value="doc" />
      </a-page-header>
    </template>
    <template #not-found>
      <a-page-header class="container">
        <a-result
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
      </a-page-header>
    </template>
  </ContentDoc>
</template>
