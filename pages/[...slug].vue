<template>
  <div class="container">
    <ContentDoc>
      <template #default="{ doc }">
        <a-page-header :title="doc.title">
          <ContentRenderer :value="doc" />
        </a-page-header>
      </template>
      <template #not-found>
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
      </template>
    </ContentDoc>
  </div>
</template>
