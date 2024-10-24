<template>
  <ContentDoc>
    <template #default="{ doc }">
      <Panel
        :header="doc.title"
        pt:root:class="!border-0 !bg-transparent"
        pt:title:class="flex items-center gap-4 font-medium text-3xl"
      >
        <ContentRenderer :value="doc" />
      </Panel>
    </template>
    <template #not-found>
      <Panel pt:root:class="!border-0 !bg-transparent">
        <div class="flex flex-col items-center">
          <div class="text-3xl font-medium mb-2">404</div>
          <div class="font-medium text-surface-500 dark:text-surface-300 mb-4">
            Sorry, the page you visited does not exist.
          </div>

          <nuxt-link to="/">
            <Button label="Back Home" icon="pi pi-home" />
          </nuxt-link>
        </div>
      </Panel>
    </template>
  </ContentDoc>
</template>
