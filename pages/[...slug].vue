<template>
  <div class="container">
    <ContentDoc v-slot="{ doc }">
      <a-page-header :title="doc.title">
        <ContentRenderer :value="doc" />
      </a-page-header>
    </ContentDoc>
  </div>
</template>
